//
//  BlsOnLoad.mm
//  react-native-bls-signatures

#import "NativeBlsModule.h"
#import <Foundation/Foundation.h>
#import <ReactCommon/CxxTurboModuleUtils.h>

@interface BlsOnLoad : NSObject
@end

@implementation BlsOnLoad

+ (void)load {
  facebook::react::registerCxxModuleToGlobalModuleMap(
      std::string(facebook::react::NativeBlsModule::kModuleName),
      [&](std::shared_ptr<facebook::react::CallInvoker> jsInvoker) {
        return std::make_shared<facebook::react::NativeBlsModule>(
            jsInvoker);
      });
}

@end
