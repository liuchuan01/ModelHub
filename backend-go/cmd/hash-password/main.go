package main

import (
	"fmt"
	"log"
	"os"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("用法: go run cmd/hash-password/main.go <password>")
		fmt.Println("示例: go run cmd/hash-password/main.go admin123")
		os.Exit(1)
	}

	password := os.Args[1]

	// 生成bcrypt哈希
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("生成密码哈希失败: %v", err)
	}

	fmt.Printf("原密码: %s\n", password)
	fmt.Printf("哈希值: %s\n", string(hash))
}
