#pragma once

#include <memory>
#include <utility>

#include "JsiG1Element.h"
#include "JsiG2Element.h"
#include "JsiHostObject.h"
#include "JsiPrivateKey.h"
#include "RNBlsUtils.h"
#include "TypedArray.h"
#include <jsi/jsi.h>

#include "bls.hpp"
using namespace bls;

namespace RNBls {

namespace jsi = facebook::jsi;

class JsiAugSchemeMPL : public RNJsi::JsiHostObject {
public:
  //----------------------------skToG1----------------------------//
  JSI_HOST_FUNCTION(skToG1) {
    auto privateKey = JsiPrivateKey::fromValue(runtime, arguments[0]);

    G1Element g1Element = AugSchemeMPL().SkToG1(privateKey);
    return JsiG1Element::toValue(runtime, g1Element);
  };

  //----------------------------keyGen----------------------------//
  JSI_HOST_FUNCTION(keyGen) {
    auto object = arguments[0].asObject(runtime);
    if (!isTypedArray(runtime, object)) {
      throw jsi::JSError(runtime, "keyGen argument is an object, but not of type Uint8Array!");
    }

    auto typedArray = getTypedArray(runtime, object);
    PrivateKey sk = AugSchemeMPL().KeyGen(typedArray.toVector(runtime));
    return JsiPrivateKey::toValue(runtime, sk);
  };

  //----------------------------sign----------------------------//
  JSI_HOST_FUNCTION(sign) {
    auto privateKey = JsiPrivateKey::fromValue(runtime, arguments[0]);
    auto message = Utils::messageFromValue(runtime, arguments[1]);

    G2Element g2Element = AugSchemeMPL().Sign(privateKey, message);
    return JsiG2Element::toValue(runtime, g2Element);
  };

  //----------------------------signPrepend----------------------------//
  JSI_HOST_FUNCTION(signPrepend) {
    auto privateKey = JsiPrivateKey::fromValue(runtime, arguments[0]);
    auto message = Utils::messageFromValue(runtime, arguments[1]);
    auto g1Element = JsiG1Element::fromValue(runtime, arguments[2]);

    G2Element g2Element = AugSchemeMPL().Sign(privateKey, message, g1Element);
    return JsiG2Element::toValue(runtime, g2Element);
  };

  //----------------------------verify----------------------------//
  JSI_HOST_FUNCTION(verify) {
    auto g1Element = JsiG1Element::fromValue(runtime, arguments[0]);
    auto message = Utils::messageFromValue(runtime, arguments[1]);
    auto g2Element = JsiG2Element::fromValue(runtime, arguments[2]);

    auto valid = AugSchemeMPL().Verify(g1Element, message, g2Element);

    return jsi::Value(valid);
  };

  //----------------------------aggregate----------------------------//
  JSI_HOST_FUNCTION(aggregate) {
    auto g2Elements = JsiG2Element::arrayFromValue(runtime, arguments[0]);

    G2Element g2Element = AugSchemeMPL().Aggregate(g2Elements);
    return JsiG2Element::toValue(runtime, g2Element);
  };

  //----------------------------aggregateVerify----------------------------//
  JSI_HOST_FUNCTION(aggregateVerify) {
    auto g1Elements = JsiG1Element::arrayFromValue(runtime, arguments[0]);
    auto messages = Utils::messagesArrayFromValue(runtime, arguments[1]);
    auto g2Element = JsiG2Element::fromValue(runtime, arguments[2]);

    auto value = AugSchemeMPL().AggregateVerify(g1Elements, messages, g2Element);

    return jsi::Value(value);
  };

  //----------------------------deriveChildSk----------------------------//
  JSI_HOST_FUNCTION(deriveChildSk) {
    auto privateKey = JsiPrivateKey::fromValue(runtime, arguments[0]);

    if (!arguments[1].isNumber()) {
      throw jsi::JSError(runtime, "deriveChildSk second argument is not a number!");
    }
    uint32_t index = arguments[1].asNumber();

    PrivateKey childSecretKey = AugSchemeMPL().DeriveChildSk(privateKey, index);

    return JsiPrivateKey::toValue(runtime, childSecretKey);
  };

  //----------------------------deriveChildSkUnhardened----------------------------//
  JSI_HOST_FUNCTION(deriveChildSkUnhardened) {
    auto privateKey = JsiPrivateKey::fromValue(runtime, arguments[0]);

    if (!arguments[1].isNumber()) {
      throw jsi::JSError(runtime, "deriveChildSkUnhardened second argument is not a number!");
    }
    uint32_t index = arguments[1].asNumber();

    PrivateKey childSecretKey = AugSchemeMPL().DeriveChildSkUnhardened(privateKey, index);

    return JsiPrivateKey::toValue(runtime, childSecretKey);
  };

  //----------------------------deriveChildPkUnhardened----------------------------//
  JSI_HOST_FUNCTION(deriveChildPkUnhardened) {
    auto g1Element = JsiG1Element::fromValue(runtime, arguments[0]);

    if (!arguments[1].isNumber()) {
      throw jsi::JSError(runtime, "deriveChildPkUnhardened second argument is not a number!");
    }
    uint32_t index = arguments[1].asNumber();

    G1Element childG1Element = AugSchemeMPL().DeriveChildPkUnhardened(g1Element, index);

    return JsiG1Element::toValue(runtime, childG1Element);
  };

  JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiAugSchemeMPL, skToG1), JSI_EXPORT_FUNC(JsiAugSchemeMPL, keyGen),
                       JSI_EXPORT_FUNC(JsiAugSchemeMPL, sign), JSI_EXPORT_FUNC(JsiAugSchemeMPL, signPrepend),
                       JSI_EXPORT_FUNC(JsiAugSchemeMPL, verify), JSI_EXPORT_FUNC(JsiAugSchemeMPL, aggregate),
                       JSI_EXPORT_FUNC(JsiAugSchemeMPL, aggregateVerify), JSI_EXPORT_FUNC(JsiAugSchemeMPL, deriveChildSk),
                       JSI_EXPORT_FUNC(JsiAugSchemeMPL, deriveChildSkUnhardened), JSI_EXPORT_FUNC(JsiAugSchemeMPL, deriveChildPkUnhardened))

  // Corrected Constructor
  explicit JsiAugSchemeMPL() : RNJsi::JsiHostObject() {}
};

} // namespace RNBls
