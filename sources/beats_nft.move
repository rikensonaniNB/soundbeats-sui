module soundbeats::beats_nft {
    use sui::url::{Self, Url};
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// An example NFT that can be minted by anybody
    struct BeatsNft has key, store {
        id: UID,
        /// Name for the token
        name: string::String,
        /// Description of the token
        description: string::String,
        /// URL for the token
        url: Url,
        // TODO: allow custom attributes
    }

    // ===== Events =====

    struct NFTMinted has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        creator: address,
        // The name of the NFT
        name: string::String,
    }

    // ===== Public view functions =====

    /// Get the NFT's `name`
    public fun name(nft: &BeatsNft): &string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &BeatsNft): &string::String {
        &nft.description
    }

    /// Get the NFT's `url`
    public fun url(nft: &BeatsNft): &Url {
        &nft.url
    }

    // ===== Entrypoints =====
    
    /// Create a new soundbeats_nft
    public entry fun mint_to_recipient(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        recipient: address,
        quantity: u32,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        let i = 0;
        while (i < quantity) {
            let nft = BeatsNft {
                id: object::new(ctx),
                name: string::utf8(name),
                description: string::utf8(description),
                url: url::new_unsafe_from_bytes(url)
            };

            event::emit(NFTMinted {
                object_id: object::id(&nft),
                creator: sender,
                name: nft.name,
            });

            transfer::public_transfer(nft, recipient);
            i = i + 1;
        }
    }

    /// Transfer `nft` to `recipient`
    public entry fun transfer(
        nft: BeatsNft, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient)
    }
}