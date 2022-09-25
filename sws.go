package main

import (
	static "github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"gopkg.in/olahol/melody.v1"
	"strings"
	"fmt"
	"os"
)

func main() {
	r := gin.Default()
	m := melody.New()
	port := os.Getenv("PORT")

	fmt.Println("Starting in port " + port)

	rooms := make(map[string][]*melody.Session)

	r.Use(static.Serve("/", static.LocalFile("./public", true)))

	r.GET("/ws", func(c *gin.Context) {
		m.HandleRequest(c.Writer, c.Request)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		msgStr := string(msg);
		params := strings.Split(msgStr, ",");
		if params[0] == "join" {
			room := rooms[params[1]]
			fmt.Println("getting room " + params[1])
			if room == nil {
				fmt.Println("new room")
				rooms[params[1]] = []*melody.Session{s}
				s.Write([]byte("welcome,{\"m\":1}"))
			} else {
				fmt.Println("room founded")
				rooms[params[1]] = append(rooms[params[1]], s)
				s.Write([]byte("welcome,{\"m\":2}"))
			}

			fmt.Println("Someone has connected")
		} else {
			fmt.Println("Someone sent " + msgStr)
			room := rooms[params[0]]
			if room == nil {
				fmt.Println("Room is empty")
				return
			}

			for _, member := range room {
				if member != s {
					toSend := msgStr[len(params[0]) + 1:]
					member.Write([]byte(toSend))
					fmt.Println("to send: " + toSend)
				}
			}
		}
	})

	r.Run(":"+port)
}