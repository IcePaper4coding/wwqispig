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
		Short:        "Start as a ksotranslateapp service",
		SilenceUsage: true,
		Run: func(cmd *cobra.Command, args []string) {
			s := service.NewService(
				//service.Server(server.NewHelloServer()),
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
