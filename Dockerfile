# Stage 1: Build stage
FROM golang:alpine AS builder

WORKDIR /app

# Install build dependencies yang valid di Alpine Linux
RUN apk add --no-cache gcc musl-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build binary aplikasi dengan Wails build tags
RUN CGO_ENABLED=0 GOOS=linux go build -tags desktop -o main .

# Stage 2: Final minimal image
FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add ca-certificates

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
