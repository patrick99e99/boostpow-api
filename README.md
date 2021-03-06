# Boost POW API Service

> Boost Proof of Work Protocol
> https://boostpow.com

Boost is a new type of content ranking system that enables users to increase the amount of energy required to mine or process their content. Users will boost their post as a way to signal to the network that they believe their information is valuable. Boosted posts will appear in the boost feed – ordered by the amount of energy requested for their information.

**Links**:

- <a href='https://github.com/matterpool/boostpow-js'>Javascript SDK: boostpow-js</a>
- <a href='https://github.com/matterpool/boostpow-api'>Standalone API Server: boostpow-api</a>
- <a href='https://media.bitcoinfiles.org/52fb4bedc85854638af61a7f906bf8e93da847d2ddb522b1aec53cfc6a0b2023'>Whitepaper</a>

## Installation

Requirements:
- Postgres 11+
- Node 10+

Tested on Ubuntu 16.04, 18.04 and OSX 10.14.4

NOTE: rename `.env.example` to `.env` for production and to `.env.test` for testing.

You must run the database migration to get started first.

```sh
# Install dependencies. Prefer yarn.
yarn install
npm install

# Production Prod build
yarn start build

# Start service
yarn start serve

```

### Database Migrations (Typeorm)

NOTE: Configure `.env.example` to `.env` for production and to `.env.test` for testing.

```sh
sudo yarn start db.migrate
```

### More Documentation (Migrations, etc)

Based off: https://github.com/w3tecch/express-typescript-boilerplate



# Boost POW

**A Protocol for Buying and Selling Proof-of-Work Embedded in Bitcoin Script**

<a href='https://boostpow.com/'>boostpow.com</a>

Boost is a new type of content ranking system that enables users to increase the amount of energy required to mine or process their content. Users will boost their post as a way to signal to the network that they believe their information is valuable. Boosted posts will appear in the boost feed – ordered by the amount of energy requested for their information.

**Links**:

- <a href='https://github.com/matterpool/boostpow-js'>Javascript SDK: boostpow-js</a>
- <a href='https://github.com/matterpool/boostpow-api'>Standalone API Server: boostpow-api</a>
- <a href='https://media.bitcoinfiles.org/52fb4bedc85854638af61a7f906bf8e93da847d2ddb522b1aec53cfc6a0b2023'>Whitepaper</a>

## MoneyButton, Relay, TwetchPay Integration

Easily integrate <a href='https://moneybutton.com'>MoneyButton</a>, <a href='https://relayx.io'>Relay</a>, and <a href='https://pay.twetch.com/docs'>TwetchPay</a>

Consult the respective documentation for additional details. All services support the 'outputs' format presented below for easy integration.

```javascript
const boost = require('boostpow-js');
// Create a Boost request with your data
const boostJob = boost.BoostPowJob.fromObject({
  content: Buffer.from('hello world', 'utf8').toString('hex'),
  diff: 1, // Minimum '1'. Specifies how much hashrate. 1 = difficulty of Bitcoin Genesis (7 MH/second)
  category: Buffer.from('B', 'hex').toString('hex'),
  additionalData: Buffer.from(`{ "foo": 1234, "metadata": "hello"}`, 'utf8').toString('hex'),
  userNonce: Buffer.from(Math.random(999999999), 'utf8').toString('hex'),
  tag: Buffer.from('funny-animals', 'utf8').toString('hex'),
});
// Construct a MoneyButton or Relay Output
const boostOutputs = [{
  script: boostJob.toASM(),
  amount: boostJob.getDiff() * 0.0001, // Charge a fee for the Boost. In future this will be a feeQuote system. Higher payout the more likely a miner will mine the boost relativity to the diff.
  currency: "BSV"
}];

// Now you can populate MoneyButton, Relay or TwetchPay with the outputs:
twetchPay.pay({
  label: 'Boost Content',
  outputs: boostOutputs,
  onPayment: async (e) => {
    console.log('payment completed', e);
    // Optionally submit to the graph database for indexing
    // In the future a planaria will pick it up automatically on-chain, for now submit the rawtx
    const boostRequestSubmit = await boost.Graph().submitBoostJob(e.rawtx);
    console.log('boostRequestSubmit', boostRequestSubmit);
  }
});

```

> The above command returns JSON structured like this after successfully submitting.

```json
{
  "success": true,
  "result": {
    "boostPowString": null,
    "boostPowMetadata": null,
    "boostHash": null,
    "boostJobId": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267.0",
    "boostJobProofId": null,
    "boostJob": {
      "boostJobId": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267.0",
      "createdTime": 1586125104,
      "txid": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267",
      "vout": 0,
      "scripthash": "b94f7355830581e0776d91b752bcea9856d4f5b6d0fbccb9d5628fff16180fce",
      "value": 10000,
      "diff": 1,
      "rawtx": "01000000026d78236444e4ffcae65b0b7ac467774ee9bb9bf233022231f918195056990504050000006a47304402204c41bfabb9a6114a1bb9472f9eeffceb4fe809aa2724dc5cb01d02b230a7c79102202bbe6bfae1c7ef183f060377ad1bfd36dc45a8fcc9dd5aad36f0b079b4cc0e374121021de3f773245db6d0aa1fa0a45483226e1dc4245fbf107dafe6614a5619700534ffffffff0e8358d2a0695438ca0086748c5eca4920a21c3412f9215389befc024341a61f030000006a4730440220136058bf2a4968f1aa6c1fb838ddb3addc09c4a0a5e0ab799eafa863c6da370c02204b81d1957c7f091b35c00f3baa4f1cc144208e42753b61457915f39cbdff4fd14121027651f21529831fc06155b71d1e673dccecdec87b9327367c8f3f4d6e6cdd484cffffffff021027000000000000e108626f6f7374706f7775040000000020747365742061207369207369687400000000000000000000000000000000000004ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac783c0000000000001976a9141c0a355b69698600f78cccd184c2cee02206c99188ac00000000",
      "spentTxid": null,
      "spentVout": 0,
      "spentRawtx": null,
      "spentScripthash": null
    },
    "boostData": {
      "categoryutf8": "",
      "category": "00000000",
      "contentutf8": "this is a test",
      "content": "0000000000000000000000000000000000007468697320697320612074657374",
      "tagutf8": "",
      "tag": "0000000000000000000000000000000000000000",
      "usernonce": "00000000",
      "additionaldatautf8": "",
      "additionaldata": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
}

```

## Create Boost Job

Create Boost Job Request.


<a href='https://github.com/MatterPool/boostpow-js/tree/master/test'>See unit tests for more examples</a>


```shell
curl -X POST https://graph.boostpow.com/api/v1/main/boost/jobs -H 'Content-Type: application/json' \
-d '{ "rawtx": "...raw tx hex containing boost output..."}'

```

```javascript
const boost = require('boostpow-js');
const result = await boost.Graph().submitBoostJob('...rawboost tx...');
```

> The above command returns JSON structured like this:

```json
{
  "success": true,
  "result": {
    "boostPowString": null,
    "boostPowMetadata": null,
    "boostHash": null,
    "boostJobId": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267.0",
    "boostJobProofId": null,
    "boostJob": {
      "boostJobId": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267.0",
      "createdTime": 1586125104,
      "txid": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267",
      "vout": 0,
      "scripthash": "b94f7355830581e0776d91b752bcea9856d4f5b6d0fbccb9d5628fff16180fce",
      "value": 10000,
      "diff": 1,
      "rawtx": "01000000026d78236444e4ffcae65b0b7ac467774ee9bb9bf233022231f918195056990504050000006a47304402204c41bfabb9a6114a1bb9472f9eeffceb4fe809aa2724dc5cb01d02b230a7c79102202bbe6bfae1c7ef183f060377ad1bfd36dc45a8fcc9dd5aad36f0b079b4cc0e374121021de3f773245db6d0aa1fa0a45483226e1dc4245fbf107dafe6614a5619700534ffffffff0e8358d2a0695438ca0086748c5eca4920a21c3412f9215389befc024341a61f030000006a4730440220136058bf2a4968f1aa6c1fb838ddb3addc09c4a0a5e0ab799eafa863c6da370c02204b81d1957c7f091b35c00f3baa4f1cc144208e42753b61457915f39cbdff4fd14121027651f21529831fc06155b71d1e673dccecdec87b9327367c8f3f4d6e6cdd484cffffffff021027000000000000e108626f6f7374706f7775040000000020747365742061207369207369687400000000000000000000000000000000000004ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac783c0000000000001976a9141c0a355b69698600f78cccd184c2cee02206c99188ac00000000",
      "spentTxid": null,
      "spentVout": 0,
      "spentRawtx": null,
      "spentScripthash": null
    },
    "boostData": {
      "categoryutf8": "",
      "category": "00000000",
      "contentutf8": "this is a test",
      "content": "0000000000000000000000000000000000007468697320697320612074657374",
      "tagutf8": "",
      "tag": "0000000000000000000000000000000000000000",
      "usernonce": "00000000",
      "additionaldatautf8": "",
      "additionaldata": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
}

```

This endpoint retrieves found Boosts matching the search querie

### HTTP Request

`POST https://graph.boostpow.com/api/v1/main/boost/jobs`

### URL Parameters

Parameter | Description
--------- | -----------
rawtx |  Raw boost tx

## Get Boost Job Status

Get Boost Job Status. Returns the status of a Boost Job. If it's mined you will see the 'boostPowString' and other fields populated.

<a href='https://github.com/MatterPool/boostpow-js/tree/master/test'>See unit tests for more examples</a>

```shell
curl  https://graph.boostpow.com/api/v1/main/boost/jobs/cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267

```

```javascript
const boost = require('boostpow-js');
const result = await boost.Graph().getBoostJobStatus('cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267');
```

> The above command returns JSON structured like this:

```json
{
  "success": true,
  "result": {
    "boostPowString": null,
    "boostPowMetadata": null,
    "boostHash": null,
    "boostJobId": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267.0",
    "boostJobProofId": null,
    "boostJob": {
      "boostJobId": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267.0",
      "createdTime": 1586125104,
      "txid": "cdd2822902bcc90bd6e4651475e2476034700353e7a0335a42783c1a1050d267",
      "vout": 0,
      "scripthash": "b94f7355830581e0776d91b752bcea9856d4f5b6d0fbccb9d5628fff16180fce",
      "value": 10000,
      "diff": 1,
      "rawtx": "01000000026d78236444e4ffcae65b0b7ac467774ee9bb9bf233022231f918195056990504050000006a47304402204c41bfabb9a6114a1bb9472f9eeffceb4fe809aa2724dc5cb01d02b230a7c79102202bbe6bfae1c7ef183f060377ad1bfd36dc45a8fcc9dd5aad36f0b079b4cc0e374121021de3f773245db6d0aa1fa0a45483226e1dc4245fbf107dafe6614a5619700534ffffffff0e8358d2a0695438ca0086748c5eca4920a21c3412f9215389befc024341a61f030000006a4730440220136058bf2a4968f1aa6c1fb838ddb3addc09c4a0a5e0ab799eafa863c6da370c02204b81d1957c7f091b35c00f3baa4f1cc144208e42753b61457915f39cbdff4fd14121027651f21529831fc06155b71d1e673dccecdec87b9327367c8f3f4d6e6cdd484cffffffff021027000000000000e108626f6f7374706f7775040000000020747365742061207369207369687400000000000000000000000000000000000004ffff001d14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac783c0000000000001976a9141c0a355b69698600f78cccd184c2cee02206c99188ac00000000",
      "spentTxid": null,
      "spentVout": 0,
      "spentRawtx": null,
      "spentScripthash": null
    },
    "boostData": {
      "categoryutf8": "",
      "category": "00000000",
      "contentutf8": "this is a test",
      "content": "0000000000000000000000000000000000007468697320697320612074657374",
      "tagutf8": "",
      "tag": "0000000000000000000000000000000000000000",
      "usernonce": "00000000",
      "additionaldatautf8": "",
      "additionaldata": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
}

```

This endpoint retrieves found Boosts matching the search query

### HTTP Request

`POST https://graph.boostpow.com/api/v1/main/boost/jobs`

### URL Parameters

Parameter | Description
--------- | -----------
txid |  Txid of the boost job to get the status

## Search Boosted Content

Search by specific fields in utf8 or raw hex (make sure to use the file byte padding length).

<a href='https://github.com/MatterPool/boostpow-js/tree/master/test'>See unit tests for more examples</a>

NOTE: You must validate the boostPowString and boostPowMetadata to confirm POW is correct.
Use BoostSignalRanker, BoostSignalSummary, or BoostPowString to do this efficiently to produce a list sorted by difficulty (energy)


**Examples**

See GraphSearchQuery interface below for all the options

<a href='https://graph.boostpow.com/api/v1/main/boost/search?content=hello'>*Find all Boost for content=hello*</a>

<a href='https://graph.boostpow.com/api/v1/main/boost/search?content=hello&category=mttr'>*Find all Boost for content=hello in category=mttr*</a>

<a href='https://graph.boostpow.com/api/v1/main/boost/search?content=hello&category=mttr&minedTimeFrom=1585869216&minedTimeEnd=1585969216'>*Find array of content in category=mttr after minedTimeFrom=1585869216 and before minedTimeEnd=1585969216</a>

```shell
curl "https://graph.boostpow.com/api/v1/main/boost/search?content=hello&contenthex=00000000000000000000000000000000000000000000000000000068656c6c6f&minedTimeFrom=0&minedTimeEnd=&category=&categoryhex=&tag=&taghex=&additionaldata=&additionaldatahex=&debug=true&expanded=true&"
```

```javascript
const boost = require('boostpow-js');

const result = await boost.Graph(options).search({
  // content: 'test1235',           // Optional. String or array of content match in utf8
  // contenthex: '00000000000000000000000000000000000000000000000000000068656c6c6f',
  // category: ['B', 'BAES'],       // Optional. String or array to match in utf8
  // categoryhex: ['....', '...'],  // Optional. String or array to match in hex
  // tag: 'bitcoin-protocol',       // Optional. String or array to match in utf8
  // taghex: '...'                  // Optional. String or array to match in hex
  // additionaldata: '',            // Optional. String or array to match in utf8
  // additionaldatahex: '...'       // Optional. String or array to match in hex
  // unmined: 'true'                // Optional. Whether to included unmined or only mined
  // additionaldatahex: '...'       // Optional. String or array to match in hex
  // See additional options below for querying and filtering
});
const ranker = boost.BoostSignalRanker.fromArray(result.mined);
// By default it ranks category by category and content then sorts by total energy
console.log('ranked list by category+content', ranker.list);
console.log('first signal summary', ranker.first.entity);
console.log('group by tag', ranker.groupByTag());
// See more options for displaying retrieved results

/*
// You can search by many different fields, including arrays for the content*, tag*, category*, additionaldata* fields.
export interface GraphSearchQuery {
    contentutf8?: string,
    content?: string,
    contenthex?: string,
    tagutf8?: string,
    tag?: string,
    taghex?: string,
    categoryutf8?: string,
    category?: string,
    categoryhex?: string,
    usernoncehex?: string,
    additionaldatahex?: string,
    additionaldatautf8?: string,
    additionaldata?: string,
    limit?: number
    createdTimeFrom?: number,
    createdTimeEnd?: number,
    minedTimeFrom?: number,
    minedTimeEnd?: number,
    boostPowString?: string,
    boostHash?: string,
    boostJobId?: string,
    boostJobProofId?: string,
    txid?: string,
    spentTxid?: string,
    unmined?: any,
    debug?: boolean,
    expanded?: boolean;
    be?: boolean, // big endian or not
    paginationToken?: string, // token to use to paginate for everything after
}
*/
```

> The above command returns JSON structured like this:

```json
{
  "q": {
    // Returns the query filter params
    "contentutf8": "hello",
    "tagutf8": "",
    "categoryutf8": "mttr",
    "be": true,
    "limit": 10000,
    "debug": true,
    "expanded": true
  },
  // To be used if search results exceed 10000
  "nextPaginationToken": null,
  // Array of mined boost signals
  "mined": [
    {
      "boostPowString": "7274746d6f6c6c65680000000000000000000000000000000000000000000000000000005a3f5b83f03b8d5b136a91fddb5b3fcd1b4e0b4aae0eeb115a1303d1e04a2a1fa071865effff001d03bd428a",
      "boostPowMetadata": "727274746d00000000000000000000000000000092e4d5ab4bb067f872d28f44d3e5433e56fca190460a3c820000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "boostHash": "000000006b5976795d399e6c2b4c06c703c84b10684b758619d2139cbce92051",
      "boostJobId": "4339e1db626e084eb83a1ab69bb0b5a6479b0f4c34c301669afbf57416d6724b.0",
      "boostJobProofId": "be44fb9d1f3fc92e1a6c926001d8e47a3c9129233beb0413f048f157c642bb12.0",
      "boostJob": {
        "boostJobId": "4339e1db626e084eb83a1ab69bb0b5a6479b0f4c34c301669afbf57416d6724b.0",
        "createdTime": 1585868322,
        "txid": "4339e1db626e084eb83a1ab69bb0b5a6479b0f4c34c301669afbf57416d6724b",
        "vout": 0,
        "scripthash": "ed54d655c3541afb323c3cc63d4339575995541cdef73d20dd796b42a750967e",
        "value": 5635,
        "diff": 1,
        "time": 1585869216,
        "rawtx": "010000000112dc8a7db4778dfdb354eb089b05828a6e8e61f82345ab58feb9cbb877a1aeda040000006a47304402205bea90f13ffe5023a1048f991bdd1b79ebc2a15693fde03c941e7b93974fb270022020cdcbbccf98f4f492b0613dd09b1cc22517b98afcc7958bd187857a455cedba412102d1901d90696ff1c8f8ebed51efc2c272a1080d659096917f4b4608af1ae2552dffffffff020316000000000000e108626f6f7374706f7775047274746d206f6c6c656800000000000000000000000000000000000000000000000000000004ffff001d14727274746d00000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac3c2e0000000000001976a91409216dac6d382d1480f2828937171e420d1abc8f88ac00000000",
        "spentTxid": "be44fb9d1f3fc92e1a6c926001d8e47a3c9129233beb0413f048f157c642bb12",
        "spentVout": 0,
        "spentRawtx": "01000000014b72d61674f5fb9a6601c3344c0f9b47a6b5b09bb61a3ab84e086e62dbe13943000000009848304502210098a176e86eed1fb0592eab2ba06bb44236c5e7406b328a4444879b9b460f7cb202201bcb9e93302271f3e7f0e8359021ae0607e5118c8ef7f75587472a354531d042412102f96821f6d9a6150e0ea06b00c8c77597e863330041be70438ff6fb211d7efe660403bd428a04a071865e08000000000000000004460a3c821492e4d5ab4bb067f872d28f44d3e5433e56fca190ffffffff01fe130000000000001976a91492e4d5ab4bb067f872d28f44d3e5433e56fca19088ac00000000",
        "spentScripthash": null
      },
      "boostData": {
        "categoryutf8": "mttr",
        "category": "6d747472",
        "contentutf8": "hello",
        "content": "00000000000000000000000000000000000000000000000000000068656c6c6f",
        "tagutf8": "mttrr",
        "tag": "0000000000000000000000000000006d74747272",
        "usernonce": "00000000",
        "additionaldatautf8": "",
        "additionaldata": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    }
  ]
}

```

This endpoint retrieves found Boosts matching the search querie

### HTTP Request

`GET https://graph.boostpow.com/api/v1/main/boost/search?content=hello&contenthex=00000000000000000000000000000000000000000000000000000068656c6c6f&minedTimeFrom=0&minedTimeEnd=&category=&categoryhex=&tag=&taghex=&additionaldata=&additionaldatahex=&debug=true&expanded=true&`

### URL Parameters

Parameter | Description
--------- | -----------
address | The address to retrieve balance for
contentutf8 | same as 'contetnt'
content | Search by utf8 content match
contenthex | Search by hex content match
tagutf8 | Same as 'tag'
tag | Search by utf8 tag match
taghex | Search by tag hex
categoryutf8 | Same as 'category'
category | Search by utf8
categoryhex | Search by hex
additionaldatahex | Search by hex
additionaldatautf8 | Same as 'additionaldata'
additionaldata | Search by utf8
limit | limit resultst to this many. (not used for now)
createdTimeFrom | Search from when the job was saved in local db
createdTimeEnd | Search to when the job was saved in local db
minedTimeFrom | Search only mined from or after
minedTimeEnd | Search only mined until or before
boostPowString | Search by exact POW string match
boostHash | Search by exact Boosthash mach
boostJobId | Search by txid+vout for the boost job
boostJobProofId | Search by spenttxid+vout for the boost job proof
txid | Search by the boost job txid
spentTxid | Search by the boost job proof txid
unmined | 'true', 'false', 'only' -- whether to include unmined boost jobs in search results
debug | boolean - default true
expanded | boolean - default true
be | boolean Big endian or not
paginationToken |  token to use to paginate for everything after

## Boost POW Entropy Sales Manager (Entropy-as-a-service)

Generate secure provably unknown random numbers using Boost POW.

The request flow:

0. Client requests a feeQuote for the price per Boost outputs number at various difficulty.
1. Ckient submits p2pkh payment request in the amount for the desired amount of difficulty for the Boost random number
2. Server responds with a txid and Boost output ddetails as the receipt.
3. Cliient queries the job request by txid, awaiting for the status to be `COMPLETE` (Boost POW outputs are all mined)


### Get feeQuote for Boost POW Entropy

```shell
curl "https://graph.boostpow.com/api/v1/main/service/feeQuote"

{
    "baseFeePerOutput": 1000,
    "feePerDifficultyPerOutput": 50,
    "serviceAddress": "1HrPapZusrjYvafbbDWUw8iG8PJKXZLYTH",
    "instructions": "Create a p2pkh payment transaction to the serviceAddress for the desired level of security in outputs and difficulty. Send the transaction payment to /api/v1/main/service/pay"
}

```

```json
// GET https://graph.boostpow.com/api/v1/main/service/feeQuote
{
    "baseFeePerOutput": 1000,
    "feePerDifficultyPerOutput": 50,
    "serviceAddress": "1HrPapZusrjYvafbbDWUw8iG8PJKXZLYTH",
    "instructions": "Create a p2pkh payment transaction to the serviceAddress for the desired level of security in outputs and difficulty. Send the transaction payment to /api/v1/main/service/pay"
}

```

### Submit Job Request for Boost POW Entropy

```shell
curl "https://graph.boostpow.com/api/v1/main/service/feeQuote"

{
  "content": "any random or static data",
  "numOutputs": 2,
  "diff": 2,
  "rawtx": "0001221... payment transaction to address: 1ndd"
}

{
  "diff": 3,
  "numOutputs": 1,
  "category": "A",
  "tag": "bitcoin",
  "content": "MatterPool Inc.",
  "rawtx": "010000000315bb5ecfdbe4b7114c371e41b592399a4fc1a9d43a64250d095a0a8555975c65650000006b483045022100eedfe16670e6f18826aa56cbf2bcf3866b25455350cc8c38ab143359af89267d022057e489ce663bb3d73bb5e96bc9275beb831771c8c246b531b5af2b90e4ebbfcb41210233feb0e6e6a10e1dfd25b4d62d6a54b65a906ca7b0372fd7373658d7917c577fffffffff15bb5ecfdbe4b7114c371e41b592399a4fc1a9d43a64250d095a0a8555975c65730000006a473044022060e62999167ff7d463a0af8b34863abd5f11945bba218db3474ea1cd21f18ef502201b65781b00011f69bcfb3086b0c5e92a3d548a5107401095ad1d50e8e3962d0b4121033715c804959e5bd86e94c139903501901be6d82ce70fb5987dfd9d50db2a1833ffffffff30a246aa57b4558f0984e3b161772c61aadcada7d72b5ceef05fedc069c231bf010000006b48304502210095251407d7176226b96f07232c0faf753722da033bb318ee38e21d47fc60332a022054910994e8a2b04d0898d0fc2fea53604a0ce0711078622455afbf90e900153741210229b883b034b42a8dd3f2c43acf7fafb661df8247a62fffb79a124147451c7976ffffffff0270120000000000001976a914b8d93f001b2fb35c1acd7cd6ac5b68acbc97a2ee88ac8d490100000000001976a9141258d967cb93e726519fe2f94b4668e74b90aac288ac00000000"
}
```

```json
// POST https://graph.boostpow.com/api/v1/main/service/pay
{
  "content": "any random or static data",
  "numOutputs": 2,
  "diff": 2,
  "rawtx": "0001221... payment transaction to address: 1ndd"
}

{
  "diff": 3,
  "numOutputs": 1,
  "category": "A",
  "tag": "bitcoin",
  "content": "MatterPool Inc.",
  "rawtx": "010000000315bb5ecfdbe4b7114c371e41b592399a4fc1a9d43a64250d095a0a8555975c65650000006b483045022100eedfe16670e6f18826aa56cbf2bcf3866b25455350cc8c38ab143359af89267d022057e489ce663bb3d73bb5e96bc9275beb831771c8c246b531b5af2b90e4ebbfcb41210233feb0e6e6a10e1dfd25b4d62d6a54b65a906ca7b0372fd7373658d7917c577fffffffff15bb5ecfdbe4b7114c371e41b592399a4fc1a9d43a64250d095a0a8555975c65730000006a473044022060e62999167ff7d463a0af8b34863abd5f11945bba218db3474ea1cd21f18ef502201b65781b00011f69bcfb3086b0c5e92a3d548a5107401095ad1d50e8e3962d0b4121033715c804959e5bd86e94c139903501901be6d82ce70fb5987dfd9d50db2a1833ffffffff30a246aa57b4558f0984e3b161772c61aadcada7d72b5ceef05fedc069c231bf010000006b48304502210095251407d7176226b96f07232c0faf753722da033bb318ee38e21d47fc60332a022054910994e8a2b04d0898d0fc2fea53604a0ce0711078622455afbf90e900153741210229b883b034b42a8dd3f2c43acf7fafb661df8247a62fffb79a124147451c7976ffffffff0270120000000000001976a914b8d93f001b2fb35c1acd7cd6ac5b68acbc97a2ee88ac8d490100000000001976a9141258d967cb93e726519fe2f94b4668e74b90aac288ac00000000"
}

```

### Check Job Status (Random Number Generator)

```shell
curl "https://graph.boostpow.com/api/v1/main/service/b20122dc091be50478fb122b32e9602c2853ad1f3eb2825e9d0c119158ce2864"

{
  "status": "COMPLETE|PENDING",
  "boostJobs": {
    "boostPowString": "42000000e36345ab06b18b402e1a86a0cd2c2b633259bfd71613d3bfdb63fd8d53982dbaa8da27b10e739cda09da551e70e5313fdfeec413564d3777f23241a8507910e8bfbe875f6066061c806eb221",
    "boostPowMetadata": "00000000000000000000000000000000000000000af0c49c7e8c842243913bbea2491027cf4e6babb0005a92b20e000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "boostHash": "000000000023375928727dd8bb58657c4e64ea88e8fc9f9170d4ed0bdbb99239",
    "boostJobId": "b20122dc091be50478fb122b32e9602c2853ad1f3eb2825e9d0c119158ce2864.0",
    "boostJobProofId": "46cee450dae826f33a3f5ea4dc2cd20e67b039021901198a1ef3c8e43c5efd0f.0",
    "boostJob": {
      "boostJobId": "b20122dc091be50478fb122b32e9602c2853ad1f3eb2825e9d0c119158ce2864.0",
      "createdTime": 1591444567,
      "txid": "b20122dc091be50478fb122b32e9602c2853ad1f3eb2825e9d0c119158ce2864",
      "vout": 0,
      "scripthash": "e6fe34a28f9b2ae75147f24dd337579d6c74bdcb8167d89a2067221f0135f4a5",
      "value": 80000,
      "diff": 40,
      "time": 1602731711,
      "rawtx": "0100000001ec6171784055897236cf18f66315b96b49d7ad671780a2c24ed2090f3f608882010000006b483045022100f54754fe8628caeabdde67e3a1d0524d12813f9a9e7b8852e53d14871b07e12c0220440495e740f6e6e5a164ab398b8eb5bda255eeeb2ab7529be0d572efb21a72d6412103746824b15ff8434b15bfaedf406eb5c6577d5ef4d51d93a0bf588c63022ccc7affffffff028038010000000000e108626f6f7374706f7775044200000020e36345ab06b18b402e1a86a0cd2c2b633259bfd71613d3bfdb63fd8d53982dba046066061c14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88aca70e4700000000001976a914079681107d10ba60c9c6a4fc1ac76f9f6ec5f03f88ac00000000",
      "spentTxid": "46cee450dae826f33a3f5ea4dc2cd20e67b039021901198a1ef3c8e43c5efd0f",
      "spentVout": 0,
      "spentRawtx": "01000000016428ce5891110c9d5e82b23e1fad53282c60e9322b12fb7804e51b09dc2201b2000000009747304402201290977ef42d09d7bc4b9767001e30261768de9eb63ac1c2adc5cc1afafc6b610220692886a0f795306121c69feb8880129b86beee7eea6bd7cdc6565608c18eba4c412102d57db0c7046be47cb88e0e737b3037f7f29ef1c78ca412860eceffa617fee7ef04806eb22104bfbe875f08b20e00000000000004b0005a92140af0c49c7e8c842243913bbea2491027cf4e6babffffffff017b360100000000001976a9140af0c49c7e8c842243913bbea2491027cf4e6bab88ac00000000",
      "spentScripthash": null
    },
    "boostData": {
      "categoryutf8": "B",
      "category": "00000042",
      "contentutf8": "�-�S��cۿ�\u0013\u0016׿Y2c+,͠�\u001a.@��\u0006�Ec�",
      "content": "ba2d98538dfd63dbbfd31316d7bf5932632b2ccda0861a2e408bb106ab4563e3",
      "tagutf8": "",
      "tag": "0000000000000000000000000000000000000000",
      "usernonce": "00000000",
      "additionaldatautf8": "",
      "additionaldata": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
}

```

```json
// GET https://graph.boostpow.com/api/v1/main/service/b20122dc091be50478fb122b32e9602c2853ad1f3eb2825e9d0c119158ce2864

{
  "status": "COMPLETE|PENDING",
  "boostJobs": {
    "boostPowString": "42000000e36345ab06b18b402e1a86a0cd2c2b633259bfd71613d3bfdb63fd8d53982dbaa8da27b10e739cda09da551e70e5313fdfeec413564d3777f23241a8507910e8bfbe875f6066061c806eb221",
    "boostPowMetadata": "00000000000000000000000000000000000000000af0c49c7e8c842243913bbea2491027cf4e6babb0005a92b20e000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "boostHash": "000000000023375928727dd8bb58657c4e64ea88e8fc9f9170d4ed0bdbb99239",
    "boostJobId": "b20122dc091be50478fb122b32e9602c2853ad1f3eb2825e9d0c119158ce2864.0",
    "boostJobProofId": "46cee450dae826f33a3f5ea4dc2cd20e67b039021901198a1ef3c8e43c5efd0f.0",
    "boostJob": {
      "boostJobId": "b20122dc091be50478fb122b32e9602c2853ad1f3eb2825e9d0c119158ce2864.0",
      "createdTime": 1591444567,
      "txid": "b20122dc091be50478fb122b32e9602c2853ad1f3eb2825e9d0c119158ce2864",
      "vout": 0,
      "scripthash": "e6fe34a28f9b2ae75147f24dd337579d6c74bdcb8167d89a2067221f0135f4a5",
      "value": 80000,
      "diff": 40,
      "time": 1602731711,
      "rawtx": "0100000001ec6171784055897236cf18f66315b96b49d7ad671780a2c24ed2090f3f608882010000006b483045022100f54754fe8628caeabdde67e3a1d0524d12813f9a9e7b8852e53d14871b07e12c0220440495e740f6e6e5a164ab398b8eb5bda255eeeb2ab7529be0d572efb21a72d6412103746824b15ff8434b15bfaedf406eb5c6577d5ef4d51d93a0bf588c63022ccc7affffffff028038010000000000e108626f6f7374706f7775044200000020e36345ab06b18b402e1a86a0cd2c2b633259bfd71613d3bfdb63fd8d53982dba046066061c14000000000000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88aca70e4700000000001976a914079681107d10ba60c9c6a4fc1ac76f9f6ec5f03f88ac00000000",
      "spentTxid": "46cee450dae826f33a3f5ea4dc2cd20e67b039021901198a1ef3c8e43c5efd0f",
      "spentVout": 0,
      "spentRawtx": "01000000016428ce5891110c9d5e82b23e1fad53282c60e9322b12fb7804e51b09dc2201b2000000009747304402201290977ef42d09d7bc4b9767001e30261768de9eb63ac1c2adc5cc1afafc6b610220692886a0f795306121c69feb8880129b86beee7eea6bd7cdc6565608c18eba4c412102d57db0c7046be47cb88e0e737b3037f7f29ef1c78ca412860eceffa617fee7ef04806eb22104bfbe875f08b20e00000000000004b0005a92140af0c49c7e8c842243913bbea2491027cf4e6babffffffff017b360100000000001976a9140af0c49c7e8c842243913bbea2491027cf4e6bab88ac00000000",
      "spentScripthash": null
    },
    "boostData": {
      "categoryutf8": "B",
      "category": "00000042",
      "contentutf8": "�-�S��cۿ�\u0013\u0016׿Y2c+,͠�\u001a.@��\u0006�Ec�",
      "content": "ba2d98538dfd63dbbfd31316d7bf5932632b2ccda0861a2e408bb106ab4563e3",
      "tagutf8": "",
      "tag": "0000000000000000000000000000000000000000",
      "usernonce": "00000000",
      "additionaldatautf8": "",
      "additionaldata": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
}

```

## Publish Widget

<a href='https://publish.boostpow.com/docs.html'>Open Docs</a>

<a href='https://publish.boostpow.com'>Sample Boost Widget</a>

Boost Publisher Widget is a simple way to boost content from your website.

Currently supported wallets are TwetchPay, Money Button and RelayX.

The simplest Boost Publisher usage looks like this:

```javascript
// in HTML
<script src="https://publish.boostpow.com/publish.js"></script>

// in javascript
boostPublish.open({
  outputs: [],
  onPayment: function(payment, boostJobStatus) {
	  console.log(payment, boostJobStatus);
  }
});

```
