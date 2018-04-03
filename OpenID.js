module.exports = class OpenID {
  constructor(query) {
    this.ns = query["openid.ns"];
    this.mode = query["openid.mode"];
    this.op_endpoint = query["openid.op_endpoint"];
    this.claimed_id = query["openid.claimed_id"];
    this.identity = query["openid.identity"];
    this.return_to = query["openid.return_to"];
    this.response_nonce = query["openid.response_nonce"];
    this.assoc_handle = query["openid.assoc_handle"];
    this.signed = query["openid.sig"];
    this.signature = query["openid.signature"];
  }
};
