package middleware

import (
	"context"
	"fmt"
	"net/http"
)

type  authString string

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r * http.Request){
		auth := r.Header.Get("Authorization")

		if auth == "" {
			next.ServeHTTP(w, r)
			return
		}
		bearer := "Bearer"
		auth = auth[len(bearer):]

		validate, err := JwtValidate(context.Background(), auth)

		// JwtValidate(context.Background(), auth)

		if err != nil || !validate.Valid {
			http.Error(w, "Wrong token", http.StatusForbidden)
			return
		}

		customClaim, _ := validate.Claims.(*JwtCustomClaim)

		ctx := context.WithValue(r.Context(), authString("auth"), customClaim)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

func CTxValue(ctx context.Context) *JwtCustomClaim{
	raw, _ := ctx.Value(authString("auth")).(*JwtCustomClaim)
	fmt.Printf(raw.ID)
	return raw
}