package main

import (
	"os"
	"wwqispig/cmd"
)

func main() {
	rootCmd := cmd.GetRootCmd(os.Args[1:])
	// 调用命令入口
	if err := rootCmd.Execute(); err != nil {
		os.Exit(-1)
	}
}
