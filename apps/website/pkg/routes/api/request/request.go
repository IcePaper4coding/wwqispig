package request

type AddDataReq struct {
	Id      string `json:"id" `
	JsonMap string `json:"jsonmap"`
}

type QueryDataReq struct {
	Id string `json:"id" `
}
