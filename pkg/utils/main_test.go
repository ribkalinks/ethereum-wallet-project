package main

import "testing"

func TestSample(t *testing.T) {
    sum := 2 + 2
    if sum != 4 {
        t.Errorf("Expected 4, got %d", sum)
    }
}