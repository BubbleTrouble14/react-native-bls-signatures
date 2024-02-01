#ifdef __cplusplus
#import "JsiBlsApi.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNBlsSpec.h"

@interface Bls : NSObject <NativeBlsSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Bls : NSObject <RCTBridgeModule>
#endif

@end
