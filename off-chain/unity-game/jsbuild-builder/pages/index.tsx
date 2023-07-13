import type { NextPage } from "next";
import { SignInButton } from "ethos-connect";

/*
How to do: 
1. rename .next to jsbuild 
2. in jsbuild/static/chunks/pages/_app-...js find the function "async autoconnect" 
3. turn it into this: 

                            async autoconnect() {
								if (c.currentWallet) {
									window.ethos = c;
									if (window.ethosConnectCallback)
										window.ethosConnectCallback();
								}
                                else {
									try {
										let e = await r.get(n);
										e && h.connect(e)
									} catch {}
								}
                            },
                            
UI CHANGES: 

- remove styling/text from connect button -
4. in jsbuild/static/chunks/pages/index-...js, find the very last 'className' element in the file. 
change from this: {className:"..etc...",children:"-"}
to this: 
{className:"display:none",children:"",id:"ConnectButton"}

- remove sign in with email button & options - 
5. in jsbuild/static/chunks/pages/index-...js, find the first occurrence of 'hideEmailSignIn'
After it, in the start of the very next function, put "n=true;" (true to hideEmailSignIn)

- remove default "Sign In" text from button - 
6. in jsbuild/static/chunks/pages/index-...js, find the string "Sign In" and change it to ""

- exclude unwanted wallets - 
7. in jsbuild/static/chucks/pages/app_....js, find this "wallets: e,selectwallet:t"
paste this code in the function: 

                    //exclude unwanted wallets 
                    if (e) {
                        for (let n=e.length-1; n>0; n--) {
                            if (e[n].name != "Ethos Wallet" && e[n].name != "Suiet") {
                                e.splice(n, 1);
                            }
                        }
                    }
                    
*/

const Home: NextPage = () => {
    return (
        <SignInButton className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">-</SignInButton>
  );
};

export default Home;
