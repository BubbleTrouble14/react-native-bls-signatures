#include "RNBlsUtils.h"

#include "JsiBlsMutableBuffer.h"
#include "bls.hpp"
#include <jsi/jsi.h>
#include <string>
#include <thread>
#include <vector>

using namespace bls;
using namespace facebook::jsi;
using namespace std;

namespace RNBls {

namespace Utils {

  std::vector<uint8_t> messageFromValue(jsi::Runtime& runtime, const jsi::Value& value) {
    if (!value.isObject()) {
      throw jsi::JSError(runtime, "Expected an object for message conversion.");
    }
    auto object = value.asObject(runtime);
    if (!object.isArrayBuffer(runtime)) {
      throw jsi::JSError(runtime, "Expected a ArrayBuffer object for message.");
    }
    auto arrayBuffer = object.getArrayBuffer(runtime);
    return ArrayBufferToVector(arrayBuffer, runtime);
  }

  vector<vector<uint8_t>> messagesArrayFromValue(Runtime& runtime, const Value& value) {
    if (!value.isObject() || !value.asObject(runtime).isArray(runtime)) {
      throw JSError(runtime, "Expected an array for messages.");
    }

    Array messagesArr = value.asObject(runtime).asArray(runtime);
    size_t messagesLength = messagesArr.length(runtime);
    vector<vector<uint8_t>> messages;
    messages.reserve(messagesLength);

    for (size_t i = 0; i < messagesLength; i++) {
      auto typeArrayObject = messagesArr.getValueAtIndex(runtime, i).asObject(runtime);
      if (!typeArrayObject.isArrayBuffer(runtime)) {
        throw JSError(runtime, "Message argument is an object, but not of type ArrayBuffer!");
      }
      auto message = ArrayBufferToVector(typeArrayObject.getArrayBuffer(runtime), runtime);

      messages.push_back(message);
    }

    return messages;
  }

  std::vector<uint8_t> ArrayBufferToVector(const jsi::ArrayBuffer& buffer, jsi::Runtime& runtime) {
    size_t size = buffer.size(runtime);
    uint8_t* dataPtr = buffer.data(runtime);
    std::vector<uint8_t> vec(dataPtr, dataPtr + size);
    return vec;
  }

} // namespace Utils

} // namespace RNBls
