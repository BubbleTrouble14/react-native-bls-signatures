#pragma once

#include <jsi/jsi.h>
#include "include/bls/bls.hpp"
using namespace bls;

using namespace bls;
using namespace facebook;

class JSI_EXPORT G1ElementHostObject : public jsi::HostObject {
public:
  static const size_t G1_SIZE;

  // Constructor
  G1ElementHostObject();

  // Overloaded Constructor to initialize with existing blst::SecretKey
  G1ElementHostObject(const G1Element& g1Element);

  // Destructor
  ~G1ElementHostObject();

  const G1Element& getG1Element() const;

  jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;

private:
  G1Element* g1Element;
};


