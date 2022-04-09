import { EthrDID } from 'ethr-did'
import { Issuer, JwtCredentialPayload, createVerifiableCredentialJwt, verifyCredential } from 'did-jwt-vc'
const dotenv = require('dotenv');
dotenv.config();

const issuer = new EthrDID({
    identifier: '0x46Fa15C8a0f6fC6773bCa6C9E686701a18Aac0A8',
    privateKey: process.env.ISSUER_PRIVATE_KEY
}) as Issuer
const vcPayload: JwtCredentialPayload = {
    sub: 'did:ethr:0xaB1A417057415E3e729E4299982A554c70B58dA0',
    nbf: 1562950282,
    vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        credentialSubject: {
            degree: {
                type: 'BachelorDegree',
                name: 'BSc. in Tutuism'
            }
        }
    }
}

import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

// see also https://github.com/decentralized-identity/ethr-did-resolver#multi-network-configuration
const providerConfig = {
    networks: [
        {
            name: "mainnet",
            rpcUrl: "https://mainnet.infura.io/v3/fab2805822b84385a374b58f137ce649"
            //91c4475bd59f4f219a4075e7b72d7add --secret
        }
        ]
    //registry: '0x46Fa15C8a0f6fC6773bCa6C9E686701a18Aac0A8'
}
const resolver = new Resolver(getResolver(providerConfig))

const main = async () => {
    const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer)
    console.log("vcJwt: ", vcJwt);
    const verifiedVC = await verifyCredential(vcJwt, resolver)
    console.log(verifiedVC)
}

main().then(r => console.log("main ran: ", r));
// eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQi...0CQmqB14NnN5XxD0d_glLRs1Myc_LBJjnuNwE