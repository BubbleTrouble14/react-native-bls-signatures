#include "Util.h"
#include "TypedArray.h"
#include "bls.hpp"
#include <jsi/jsi.h>
#include <string>
#include <thread>
#include <vector>

using namespace bls;
using namespace facebook::jsi;
using namespace std;

namespace utils {

std::vector<uint8_t> messageFromValue(jsi::Runtime& runtime, const jsi::Value& value) {
  if (!value.isObject()) {
    throw jsi::JSError(runtime, "Expected an object for message conversion.");
  }
  auto object = value.asObject(runtime);
  if (!isTypedArray(runtime, object)) {
    throw jsi::JSError(runtime, "Expected a Uint8Array object for message.");
  }
  auto typedArray = getTypedArray(runtime, object);
  return typedArray.toVector(runtime);
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
    if (!isTypedArray(runtime, typeArrayObject)) {
      throw JSError(runtime, "Message argument is an object, but not of type Uint8Array!");
    }
    auto messageArray = getTypedArray(runtime, typeArrayObject);
    vector<uint8_t> message = messageArray.toVector(runtime);
    messages.push_back(message);
  }

  return messages;
}

void install(Runtime& jsiRuntime) {
  auto hash256 = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "hash256"), 1,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
        if (count != 1) {
          throw jsi::JSError(runtime, "hash256 expects 1 argument!");
        }

        auto object = arguments[0].asObject(runtime);
        if (!isTypedArray(runtime, object)) {
          throw jsi::JSError(runtime, "hash256 argument is an object, but not of type Uint8Array!");
        }
        auto typedArray = getTypedArray(runtime, object);

        uint8_t hash[32];
        bls::Util::Hash256(hash, typedArray.getBuffer(runtime).data(runtime), typedArray.size(runtime));

        auto hashArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, 32);
        auto arrayBuffer = hashArray.getBuffer(runtime);

        memcpy(arrayBuffer.data(runtime), hash, 32);

        return hashArray;
      });

  jsiRuntime.global().setProperty(jsiRuntime, "hash256", std::move(hash256));

  auto toHex = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "toHex"), 1,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
        if (count != 1) {
          throw jsi::JSError(runtime, "toHex expects 1 argument!");
        }

        auto object = arguments[0].asObject(runtime);
        if (!isTypedArray(runtime, object)) {
          throw jsi::JSError(runtime, "toHex argument is an object, but not of type Uint8Array!");
        }
        auto typedArray = getTypedArray(runtime, object);

        auto hex = jsi::String::createFromUtf8(runtime, Util::HexStr(typedArray.toVector(runtime)));

        return hex;
      });

  jsiRuntime.global().setProperty(jsiRuntime, "toHex", std::move(toHex));

  auto fromHex = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "fromHex"), 1,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
        if (count != 1) {
          throw jsi::JSError(runtime, "fromHex expects 1 argument!");
        }

        if (!arguments[0].isString()) {
          throw jsi::JSError(runtime, "fromHex argument is not a string!");
        }

        auto hex = arguments[0].asString(runtime);

        auto bytes = Util::HexToBytes(hex.utf8(runtime));

        auto byteArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, bytes.size());
        auto arrayBuffer = byteArray.getBuffer(runtime);

        memcpy(arrayBuffer.data(runtime), bytes.data(), bytes.size());

        return byteArray;
      });

  jsiRuntime.global().setProperty(jsiRuntime, "fromHex", std::move(fromHex));

  auto getRandomSeed = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "getRandomSeed"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "getRandomSeed does not expect any arguments.");
        }

        uint8_t buf[32];

        // Replace this with a cryptographically secure RNG if this is used for cryptographic purposes.
        for (int i = 0; i < 32; i++)
          buf[i] = rand();

        auto byteArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, 32);
        auto arrayBuffer = byteArray.getBuffer(runtime);

        memcpy(arrayBuffer.data(runtime), buf, 32);

        return byteArray;
      });

  jsiRuntime.global().setProperty(jsiRuntime, "getRandomSeed", std::move(getRandomSeed));
}
} // namespace utils
