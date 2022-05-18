import path from 'path';
import {
  emulator,
  init,
  shallResolve,
  getAccountAddress,
  shallRevert
} from 'flow-js-testing';
import {
  deployNFTCatalog,
  setupNFTCatalogAdminProxy,
  sendAdminProxyCapability,
  addToCatalog
} from '../src/nftcatalog';
import {
  deployExampleNFT,
  setupExampleNFTCollection,
  mintExampleNFT,
  getExampleNFTType
} from '../src/examplenft';
import { getAllNFTsInAccount, getNFTsInAccount, deployNFTRetrieval, getNFTInAccount } from '../src/nftviews';


describe('NFT Retrieval Test Suite', () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, '../../');
    const port = 7002;
    await init(basePath, { port });
    await emulator.start(port, false);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  });

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    await emulator.stop();
    return new Promise((resolve) => setTimeout(resolve, 1000));
  });

  it('should retrieve all NFTs', async () => {
    await deployNFTCatalog();
    const Bob = await getAccountAddress('Bob');
    await setupNFTCatalogAdminProxy(Bob);
    await sendAdminProxyCapability(Bob)

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');
    const Alice = await getAccountAddress('Alice');
    await setupExampleNFTCollection(Alice)

    await deployNFTRetrieval();

    const [nftTypeIdentifier, _] = await getExampleNFTType();
    await addToCatalog(
      Bob,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      'exampleNFTCollection',
      'exampleNFTCollection'
    )
    const nftName = 'Test Name';
    const nftDescription = 'Test Description';
    const thumbnail = 'https://flow.com/';
    await mintExampleNFT(Alice, nftName, nftDescription, thumbnail, [], [], []);

    const [result, error] = await shallResolve(getAllNFTsInAccount(Alice));
    expect(error).toBe(null);
    expect(result['ExampleNFT'][0].display.name).toBe(nftName);
    expect(result['ExampleNFT'][0].display.description).toBe(nftDescription);
    expect(result['ExampleNFT'][0].display.thumbnail.url).toBe(thumbnail);
  });

  it('should retrieve some NFTs', async () => {
    await deployNFTCatalog();
    const Bob = await getAccountAddress('Bob');
    await setupNFTCatalogAdminProxy(Bob);
    await sendAdminProxyCapability(Bob)

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');
    const Alice = await getAccountAddress('Alice');
    await setupExampleNFTCollection(Alice)

    await deployNFTRetrieval();

    const [nftTypeIdentifier, _] = await getExampleNFTType();
    await addToCatalog(
      Bob,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      'exampleNFTCollection',
      'exampleNFTCollection'
    )
    const nftName = 'Test Name';
    const nftDescription = 'Test Description';
    const thumbnail = 'https://flow.com/';
    await mintExampleNFT(Alice, nftName, nftDescription, thumbnail, [], [], []);

    let [result, error] = await shallResolve(getNFTsInAccount(Alice, ['ExampleNFT']));
    expect(result['ExampleNFT'][0].display.name).toBe(nftName);
    expect(result['ExampleNFT'][0].display.description).toBe(nftDescription);
    expect(result['ExampleNFT'][0].display.thumbnail.url).toBe(thumbnail);
    expect(error).toBe(null);

    [result, error] = await shallResolve(getNFTsInAccount(Alice, []));
    expect(Object.keys(result).length).toBe(0);
    expect(error).toBe(null);

    [result, error] = await shallResolve(getNFTsInAccount(Alice, ["NotARealNFT"]));
    expect(Object.keys(result).length).toBe(0);
    expect(error).toBe(null);
  });

  it('should retrieve specific NFT', async () => {
    await deployNFTCatalog();
    const Bob = await getAccountAddress('Bob');
    await setupNFTCatalogAdminProxy(Bob);
    await sendAdminProxyCapability(Bob)

    let res = await deployExampleNFT();
    const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');
    const Alice = await getAccountAddress('Alice');
    await setupExampleNFTCollection(Alice)

    await deployNFTRetrieval();

    const [nftTypeIdentifier, _] = await getExampleNFTType();
    await addToCatalog(
      Bob,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.contract,
      nftCreationEvent.data.address,
      nftTypeIdentifier,
      'exampleNFTCollection',
      'exampleNFTCollection'
    )
    const nftName = 'Test Name';
    const nftDescription = 'Test Description';
    const thumbnail = 'https://flow.com/';
    await mintExampleNFT(Alice, nftName, nftDescription, thumbnail, [], [], []);

    await shallRevert(getNFTInAccount(Alice, 'ExampleNFT2', 0));
    await shallRevert(getNFTInAccount(Bob, 'ExampleNFT', 0));
    await shallRevert(getNFTInAccount(Alice, 'ExampleNFT', 1));

    const [result, error] = await shallResolve(getNFTInAccount(Alice, 'ExampleNFT', 0))
    expect(result.display.name).toBe(nftName);
    expect(result.display.description).toBe(nftDescription);
    expect(result.display.thumbnail.url).toBe(thumbnail);
    expect(error).toBe(null);
  });
});