import { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';

export const useCustomWalletConnect = () => {
  const { select, connect, connected, connecting, publicKey, disconnect, wallet } = useWallet();

  const connectWithCustomMessage = useCallback(async (walletName: WalletName) => {
    try {
      console.log('🚀 Initiating Aethel AI wallet connection for:', walletName);
      
      // Set app metadata BEFORE wallet connection for wallet recognition
      if (typeof window !== 'undefined') {
        // Set document title that wallets read
        const originalTitle = document.title;
        document.title = 'Aethel AI';
        
        // Set favicon to your logo
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = '/assets/logo.png';
        } else {
          const newFavicon = document.createElement('link');
          newFavicon.rel = 'icon';
          newFavicon.href = '/assets/logo.png';
          document.head.appendChild(newFavicon);
        }
        
        // Add/update meta tags for wallet recognition
        const metaTags = [
          { name: 'application-name', content: 'Aethel AI' },
          { name: 'apple-mobile-web-app-title', content: 'Aethel AI' },
          { property: 'og:site_name', content: 'Aethel AI' },
          { property: 'og:title', content: 'Aethel AI' },
          { property: 'og:image', content: `${window.location.origin}/assets/logo.png` }
        ];
        
        metaTags.forEach(tag => {
          const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
          let existingTag = document.querySelector(selector) as HTMLMetaElement;
          
          if (existingTag) {
            existingTag.content = tag.content;
          } else {
            const meta = document.createElement('meta');
            if (tag.name) meta.name = tag.name;
            if (tag.property) meta.setAttribute('property', tag.property);
            meta.content = tag.content;
            document.head.appendChild(meta);
          }
        });
        
        // Restore original title after a delay
        setTimeout(() => {
          document.title = originalTitle;
        }, 5000);
      }
      
      // Check if wallet is already selected and connected
      if (connected && wallet?.adapter.name === walletName) {
        console.log('✅ Wallet already connected:', walletName);
        return { success: true, signature: null };
      }
      
      // First select the wallet
      console.log('📱 Selecting wallet:', walletName);
      select(walletName);
      
      // Wait for wallet selection to complete and verify it's selected
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Check if wallet is selected
        if (wallet?.adapter.name === walletName) {
          console.log('✅ Wallet selected successfully:', walletName);
          break;
        }
        
        attempts++;
        console.log(`⏳ Waiting for wallet selection... (${attempts}/${maxAttempts})`);
      }
      
      // Verify wallet is selected before connecting
      if (!wallet || wallet.adapter.name !== walletName) {
        throw new Error(`Failed to select wallet: ${walletName}. Current wallet: ${wallet?.adapter.name || 'none'}`);
      }
      
      // Proceed with connection
      console.log('🔗 Connecting to wallet...');
      await connect();
      console.log('✅ Wallet connected successfully');
      
      // Return success immediately - we'll handle signature in a separate effect
      return { success: true, signature: null };
      
    } catch (error) {
      console.error('❌ Aethel AI wallet connection failed:', error);
      throw error;
    }
  }, [select, connect, wallet, connected]);

  // Separate function for signature request after connection
  const requestSignature = useCallback(async () => {
    if (!connected || !wallet?.adapter || !('signMessage' in wallet.adapter)) {
      console.log('ℹ️ Wallet not ready for signature or does not support message signing');
      return null;
    }

    try {
      console.log('🔐 Requesting Aethel AI signature verification...');
      
      const signatureMessage = `🤖 Welcome to Aethel AI!

By signing this message, you confirm your connection to Aethel AI's AI-powered platform.

✨ What you're accessing:
• AI Agent Management System  
• Smart Trading & Analytics Tools
• Secure Blockchain Interactions
• Advanced AI Features

🔒 Security Notice:
• We never store your private keys
• Your wallet remains under your control  
• This signature proves wallet ownership

🌐 Platform: Aethel AI
📅 Connected: ${new Date().toLocaleString()}
🔗 Domain: ${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}
⚡ Network: Solana Mainnet

By signing, you agree to Aethel AI's Terms of Service.`;

      const encoder = new TextEncoder();
      const messageBytes = encoder.encode(signatureMessage);
      
      // Request signature - this will show the custom message
      const signature = await wallet.adapter.signMessage(messageBytes);
      console.log('✅ Aethel AI signature completed successfully!');
      
      return signature;
      
    } catch (signError) {
      console.log('ℹ️ User declined signature verification (optional)');
      return null;
    }
  }, [connected, wallet]);

  return {
    connectWithCustomMessage,
    requestSignature,
    connected,
    connecting,
    publicKey,
    disconnect,
    wallet
  };
};