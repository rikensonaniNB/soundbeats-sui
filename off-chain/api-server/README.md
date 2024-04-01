# Soundbeats-Sui API 

## POST /api/v1/nfts (MintBeatsNftDto)
Same as calling POST /api/v1/nfts/beats

Returns: MintNftResponseDto

        
## POST /api/v1/nfts/beats (MintBeatsNftDto)
Mints a quantity of BEATS NFTs to a given recipient. 

Returns: MintNftResponseDto

        
## POST /api/v1/nfts/beatmaps (MintBeatmapsNftDto)
Mints a quantity of BEATMAPS NFTs to a given recipient. 

Returns: MintNftResponseDto

        
## GET /api/v1/nfts (GetBeatsNftsDto)
Same as GET /api/v1/nfts/beats

Returns: GetBeatsNftsResponseDto

        
## GET /api/v1/nfts/beats (GetBeatsNftsDto)
Gets the BEATS NFTs currently owned by a given address.

Returns: GetBeatsNftsResponseDto

        
## GET /api/v1/nfts/beatmaps (GetBeatmapsNftsDto)
Gets the BEATMAPS NFTs currently owned by a given address.

Returns: GetBeatmapsNftsResponseDto

        
## POST /api/v1/token (MintTokenDto)
Mint a quantity of BEATS token to a given recipient. 

Returns: MintTokenResponseDto

        
## GET /api/v1/token (GetTokenBalanceDto)
Gets the amount of BEATS token owned by a given address.

Returns: GetTokenBalanceResponseDto

        
## GET /api/v1/verify (VerifySignatureDto)
Verify a SUI signature (deprecated)

Returns: VerifySignatureResponseDto

        
## GET /api/v1/username (CheckUsernameDto)
Check whether or not a username exists.

Returns: CheckUsernameResponseDto

        
## Get /api/v1/leaderboard (GetLeaderboardDto)
Gets leaderboard score data. 

Returns: GetLeaderboardResponseDto

        
## POST /api/v1/leaderboard (AddLeaderboardDto)
Adds leaderboard score data. 

Returns: AddLeaderboardResponseDto

        
## GET /api/v1/sprint (GetLeaderboardSprintDto)
Get leaderboard sprints data. 

Returns: GetLeaderboardSprintResponseDto

        
## POST /api/v1/auth (StartAuthSessionDto)
Start a private authentication session. 

Returns: StartAuthSessionResponseDto

    
## POST /api/v1/verify (AuthVerifyDto)
New SUI/EVM signature verification function. 

Calling with action:'verify' verifies only. 

Calling with action:'update' can update a username oreate a new account if one doesn't exist yet.

Returns: AuthVerifyResponseDto


## GET /api/v1/accounts (GetAccountDto)
Gets account data. 

Returns: GetAccountResponseDto



