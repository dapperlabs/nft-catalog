import { executeScript, mintFlow, deployContractByName } from 'flow-js-testing'
import { getAdminAddress } from './common'

export const deployNFTRetrieval = async () => {
    const NFTRetrievalAdmin = await getAdminAddress()
    await mintFlow(NFTRetrievalAdmin, '10.0')
    return deployContractByName({ to: NFTRetrievalAdmin, name: 'NFTRetrieval' })
}

export const getAllNFTsInAccount = async (ownerAddress) => {
    const name = 'get_all_nfts_in_account';
    const args = [ownerAddress];

    return executeScript({ name, args });
}

export const getNFTsCountInAccount = async (ownerAddress) => {
    const name = 'get_nfts_count_in_account';
    const args = [ownerAddress];

    return executeScript({ name, args });
}

export const getNFTsInAccount = async (ownerAddress, collectionIdentifiers) => {
    const name = 'get_nfts_in_account';
    const args = [ownerAddress, collectionIdentifiers];

    return executeScript({ name, args });
}

export const getNFTIDsInAccount = async (ownerAddress) => {
    const name = 'get_nft_ids_in_account';
    const args = [ownerAddress]

    return executeScript({ name, args });
}

export const getNFTInAccount = async (ownerAddress, collectionIdentifier, tokenID) => {
    const name = 'get_nft_in_account';
    const args = [ownerAddress, collectionIdentifier, tokenID];

    return executeScript({ name, args });
}

export const getNFTsInAccountFromPath = async (ownerAddress, storagePathIdentifier) => {
    const name = 'get_nfts_in_account_from_path';
    const args = [ownerAddress, storagePathIdentifier];

    return executeScript({ name, args });
}

export const getNFTInAccountFromPath = async (ownerAddress, storagePathIdentifier, nftID) => {
    const name = 'get_nft_in_account_from_path';
    const args = [ownerAddress, storagePathIdentifier, nftID];

    return executeScript({ name, args });
}
