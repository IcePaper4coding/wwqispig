package response

type QueryDataRsp struct {
	Id      string `json:"id" `
	JsonMap string `json:"jsonmap"`
}

type GlobalRsp struct {
	Code int         `json:"code" `
	Msg  string      `json:"msg" `
	Data interface{} `json:"data" `
}
