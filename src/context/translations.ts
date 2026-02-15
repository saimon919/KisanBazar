export const translations = {
    en: {
        nav: {
            home: 'Home',
            marketplace: 'Marketplace',
            dashboard: 'Dashboard',
            login: 'Login',
            register: 'Register',
            logout: 'Logout'
        },
        hero: {
            title: 'Connecting Nepal\'s Farmers to Your Table',
            subtitle: 'Trusted Digital Agricultural Partner of Nepal',
            ctaShop: 'Shop Now',
            ctaStartSelling: 'Start Selling'
        },
        marketplace: {
            title: 'Marketplace',
            searchPlaceholder: 'Search vegetables, fruits...',
            categories: {
                all: 'All',
                vegetable: 'Vegetable',
                fruit: 'Fruit',
                grain: 'Grain'
            },
            newArrivals: '✨ New Arrivals',
            noResults: 'No products found matching your criteria.'
        },
        product: {
            by: 'By',
            addToCart: 'Add to Cart',
            verified: 'Verified Farmer'
        },
        cart: {
            title: 'Your Cart',
            empty: 'Your cart is empty',
            summary: 'Order Summary',
            subtotal: 'Subtotal',
            shipping: 'Shipping',
            total: 'Total',
            checkout: 'Checkout'
        },
        auth: {
            loginTitle: 'Login to KisanBazaar',
            registerTitle: 'Create Account',
            name: 'Full Name',
            email: 'Email Address',
            password: 'Password',
            role: 'I am a...',
            buyer: 'Buyer',
            seller: 'Seller',
            location: 'Farm Location',
            citizenship: 'Citizenship/ID Photo',
            submitLogin: 'Sign In',
            submitRegister: 'Sign Up'
        },
        trust: {
            p2pTitle: 'Direct P2P Payments',
            p2pNotice: 'KisanBazaar is a facilitator. All payments are processed directly between customers and farmers via manual transfer.'
        }
    },
    ne: {
        nav: {
            home: 'गृहपृष्ठ',
            marketplace: 'बजार',
            dashboard: 'ड्यासबोर्ड',
            login: 'लगइन',
            register: 'दर्ता गर्नुहोस्',
            logout: 'लगआउट'
        },
        hero: {
            title: 'नेपालका किसानलाई तपाईंको भान्छासम्म जोड्दै',
            subtitle: 'नेपालको भरपर्दो डिजिटल कृषि साझेदार',
            ctaShop: 'अहिले किन्नुहोस्',
            ctaStartSelling: 'बिक्री सुरु गर्नुहोस्'
        },
        marketplace: {
            title: 'बजार',
            searchPlaceholder: 'तरकारी, फलफूल खोज्नुहोस्...',
            categories: {
                all: 'सबै',
                vegetable: 'तरकारी',
                fruit: 'फलफूल',
                grain: 'अन्न'
            },
            newArrivals: '✨ नयाँ उत्पादनहरू',
            noResults: 'तपाईंको मापदण्डसँग मिल्ने कुनै उत्पादनहरू फेला परेनन्।'
        },
        product: {
            by: 'किसान:',
            addToCart: 'कार्टमा थप्नुहोस्',
            verified: 'प्रमाणित किसान'
        },
        cart: {
            title: 'तपाईंको कार्ट',
            empty: 'तपाईंको कार्ट खाली छ',
            summary: 'अर्डर सारांश',
            subtotal: 'उप-योग',
            shipping: 'ढुवानी',
            total: 'कुल योग',
            checkout: 'चेकआउट गर्नुहोस्'
        },
        auth: {
            loginTitle: 'किसानबजारमा लगइन गर्नुहोस्',
            registerTitle: 'खाता खोल्नुहोस्',
            name: 'पूरा नाम',
            email: 'इमेल ठेगाना',
            password: 'पासवर्ड',
            role: 'म एक...',
            buyer: 'ग्राहक',
            seller: 'किसान',
            location: 'फार्मको ठेगाना',
            citizenship: 'नागरिकता/ID फोटो',
            submitLogin: 'लगइन गर्नुहोस्',
            submitRegister: 'दर्ता गर्नुहोस्'
        },
        trust: {
            p2pTitle: 'सीधा P2P भुक्तानी',
            p2pNotice: 'किसानबजार एक सहजकर्ता हो। सबै भुक्तानीहरू म्यानुअल स्थानान्तरण मार्फत ग्राहक र किसानहरू बीच सीधा प्रशोधन गरिन्छ।'
        }
    }
};

export type Language = 'en' | 'ne';
