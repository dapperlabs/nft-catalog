import { mintFlow, deployContractByName, sendTransaction, executeScript } from 'flow-js-testing'
import { getAdminAddress } from './common'

export const deployNFTCatalog = async () => {
  const NFTCatalogAdmin = await getAdminAddress()
  await mintFlow(NFTCatalogAdmin, '10.0')
  await deployContractByName({ to: NFTCatalogAdmin, name: 'NonFungibleToken' })
  await deployContractByName({ to: NFTCatalogAdmin, name: 'MetadataViews' })
  await deployContractByName({ to: NFTCatalogAdmin, name: 'NFTCatalog' })
  return deployContractByName({ to: NFTCatalogAdmin, name: 'NFTCatalogAdmin' })
}

export const addToCatalogAdmin = async (collectionName, contractName, contractAddress, nftTypeIdentifier, addressWithNFT, publicPathIdentifier) => {
  const NFTCatalogAdmin = await getAdminAddress();
  const name = 'add_to_nft_catalog_admin';

  const signers = [NFTCatalogAdmin];
  const args = [collectionName, contractName, contractAddress, nftTypeIdentifier, addressWithNFT, publicPathIdentifier];

  return sendTransaction({ name, args, signers });
}

export const addToCatalog = async (proxyAccount, collectionName, contractName, contractAddress, nftTypeIdentifier, addressWithNFT, publicPathIdentifier) => {
  const name = 'add_to_nft_catalog';

  const signers = [proxyAccount];
  const args = [collectionName, contractName, contractAddress, nftTypeIdentifier, addressWithNFT, publicPathIdentifier];

  return sendTransaction({ name, args, signers });
}

export const removeFromNFTCatalog = async (proxyAccount, collectionName) => {
  const name = 'remove_from_nft_catalog';

  const signers = [proxyAccount];

  const args = [collectionName];

  return sendTransaction({ name, args, signers });
}

export const updateNFTCatalogEntry = async (proxyAccount, collectionName, contractName, contractAddress, nftTypeIdentifier, addressWithNFT, publicPathIdentifier) => {
  const name = 'update_nft_catalog_entry';

  const signers = [proxyAccount];
  const args = [collectionName, contractName, contractAddress, nftTypeIdentifier, addressWithNFT, publicPathIdentifier];

  return sendTransaction({ name, args, signers });
}

export const setupNFTCatalogAdminProxy = async (account) => {
  const name = 'setup_nft_catalog_admin_proxy';
  const signers = [account];

  return sendTransaction({ name, signers })
}

export const sendAdminProxyCapability = async (ownerAccount) => {
  const NFTCatalogAdmin = await getAdminAddress();
  const signers = [NFTCatalogAdmin];

  const name = 'send_admin_capability_to_proxy';

  const args = [ownerAccount];

  return sendTransaction({ name, args, signers });
}

export const proposeNFTToCatalog = async (account, collectionName, contractName, contractAddress, nftTypeIdentifier, addressWithNFT, publicPathIdentifier, message) => {
  const name = 'propose_nft_to_catalog';
  const args = [collectionName, contractName, contractAddress, nftTypeIdentifier, addressWithNFT, publicPathIdentifier, message];
  const signers = [account];

  return sendTransaction({ name, args, signers });
}

export const withdrawNFTProposalFromCatalog = async (account, proposalID) => {
  const name = 'withdraw_nft_proposal_from_catalog';
  const args = [proposalID];
  const signers = [account];

  return sendTransaction({ name, args, signers });
}

export const approveNFTProposal = async (account, proposalID) => {
  const name = 'approve_nft_catalog_proposal';
  const args = [proposalID];
  const signers = [account];

  return sendTransaction({ name, args, signers });
}

export const rejectNFTProposal = async (account, proposalID) => {
  const name = 'reject_nft_catalog_proposal';
  const args = [proposalID];
  const signers = [account];

  return sendTransaction({ name, args, signers });
}

export const removeNFTProposal = async (account, proposalID) => {
  const name = 'remove_nft_catalog_proposal';
  const args = [proposalID];
  const signers = [account];

  return sendTransaction({ name, args, signers });
}

export const getNFTMetadataForCollectionName = async (collectionName) => {
  const name = 'get_nft_metadata_for_collection_name';
  const args = [collectionName];

  return executeScript({ name, args });
}

export const getNFTCollectionsForNFTType = async (nftTypeIdentifier) => {
  const name = 'get_nft_collections_for_nft_type';
  const args = [nftTypeIdentifier];

  return executeScript({ name, args });
}

export const getNFTProposalForID = async (proposalID) => {
  const name = 'get_nft_proposal_for_id';
  const args = [proposalID];

  return executeScript({ name, args });
}