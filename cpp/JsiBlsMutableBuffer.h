#pragma once

#include <jsi/jsi.h>

using namespace facebook;

namespace RNBls {
class JsiBlsMutableBuffer : public jsi::MutableBuffer {
public:
  JsiBlsMutableBuffer(size_t size) : size_(size), data_(new uint8_t[size]) {}
  ~JsiBlsMutableBuffer() {
    delete[] data_;
  }

  size_t size() const override {
    return size_;
  }
  uint8_t* data() override {
    return data_;
  }

private:
  size_t size_;
  uint8_t* data_;
};
} // namespace RNBls
