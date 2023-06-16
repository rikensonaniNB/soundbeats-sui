### Fix the server after the network reset

#### 1. Setup the keypair and get some Sui token

1. Obtain the Mnemonic phrase from 1Password (publickey: `0x121708f3b5fb7a28989e7780266ce9853d48d0d4`)
1. Setup the Sui client `sui keytool import "<mnemonic-phrase>" ed25519`
1. Switch the active address `sui client switch --address 0x121708f3b5fb7a28989e7780266ce9853d48d0d4`
1. Go to the dev-faucet channel in Sui Discord to obtain some Sui token

#### 2. Deploy first contract

1. Checkout the nft_protocol reop from Releap Github
1. Run `sui client gas` command to find a gas objectId
1. Deploy the contract use the command `GAS=<gas-objectId> ./bin/publish.sh`

#### 3. Deply second contract

1. Checkout the Sui reop from the offical Github
1. Go to the directory `./sui_programmability/examples/fungible_tokens`
1. Deploy the contract use the command `sui client publish --path . --gas-budget 5000` (You may need to update `Move.toml` if the compiler fail to compile the contract)

#### 4. Restart the server

1. Go to AWS Elastic Beanstalk (Region: ap-southeast-1)
1. Click the env `Releapgamepoc-env`
1. Click the `Actions` dropdown and `Restart app server(s)`


