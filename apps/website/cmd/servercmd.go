package cmd

import (
	"wwqispig/pkg/libs/service"
	"wwqispig/pkg/server"

	"github.com/spf13/cobra"
)

var s service.Service

func ServerCmd() *cobra.Command {
	serverCmd := &cobra.Command{
		Use:          "service",
		Short:        "Start as a website service",
		SilenceUsage: true,
		Run: func(cmd *cobra.Command, args []string) {
			// 新建服务类, 用于初始化以及运作,通过AOP打印日志
			s := service.NewService(
				// service.Server(server.NewHelloServer()),
				service.BeforeStart(func() error {
					return nil
				}),
				service.Server(server.NewhttpServer()),
				service.AfterStop(func() error {
					return nil
				}))
			s.Init()

			if err := s.Run(); err != nil {
			}
		},
	}

	return serverCmd
}

func GetService() []server.Server {
	return s.Servers()
}
