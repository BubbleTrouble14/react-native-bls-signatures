#pragma once

#include <jsi/jsi.h>

#include "include/bls/bls.hpp"
using namespace bls;

using namespace facebook;

class JSI_EXPORT BasicSchemeMPLHostObject : public jsi::HostObject
{
public:
  // Constructor
  BasicSchemeMPLHostObject();

  // Destructor
  ~BasicSchemeMPLHostObject();

  jsi::Value get(jsi::Runtime &, const jsi::PropNameID &name) override;
  std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime &rt) override;
};
