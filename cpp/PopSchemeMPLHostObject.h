#pragma once

#include <jsi/jsi.h>

#include "include/bls/bls.hpp"
using namespace bls;


using namespace facebook;

class JSI_EXPORT PopSchemeMPLHostObject : public jsi::HostObject {
public:
  // Constructor
  PopSchemeMPLHostObject();

  // Destructor
  ~PopSchemeMPLHostObject();

  jsi::Value get(jsi::Runtime&, const jsi::PropNameID& name) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime& rt) override;

};
