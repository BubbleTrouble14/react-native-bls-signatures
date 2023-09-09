#pragma once

#include <jsi/jsi.h>
#include "include/bls/bls.hpp"

using namespace bls;
using namespace facebook;

class JSI_EXPORT G2ElementHostObject : public jsi::HostObject {
public:
  // Constructor
  G2ElementHostObject();

  // Overloaded Constructor to initialize with existing blst::SecretKey
  G2ElementHostObject(const G2Element& g2Element);

  // Destructor
  ~G2ElementHostObject();

  const G2Element& getG2Element() const;

  jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;

private:
  G2Element* g2Element;
};


