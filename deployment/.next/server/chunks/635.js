"use strict";
exports.id = 635;
exports.ids = [635];
exports.modules = {

/***/ 635:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  JO: () => (/* reexport */ AccessToken),
  mu: () => (/* reexport */ RoomServiceClient)
});

// UNUSED EXPORTS: AgentDispatchClient, AliOSSUpload, AudioCodec, AutoParticipantEgress, AutoTrackEgress, AzureBlobUpload, DataPacket_Kind, DirectFileOutput, EgressClient, EgressInfo, EgressStatus, EncodedFileOutput, EncodedFileType, EncodingOptions, EncodingOptionsPreset, GCPUpload, ImageCodec, ImageFileSuffix, ImageOutput, IngressAudioEncodingOptions, IngressAudioEncodingPreset, IngressAudioOptions, IngressClient, IngressInfo, IngressInput, IngressState, IngressVideoEncodingOptions, IngressVideoEncodingPreset, IngressVideoOptions, ParticipantEgressRequest, ParticipantInfo, ParticipantInfo_State, ParticipantPermission, Room, RoomCompositeEgressRequest, RoomEgress, S3Upload, SIPDispatchRuleInfo, SIPParticipantInfo, SIPTrunkInfo, SegmentedFileOutput, SegmentedFileProtocol, SipClient, StreamOutput, StreamProtocol, TokenVerifier, TrackCompositeEgressRequest, TrackEgressRequest, TrackInfo, TrackSource, TrackType, VideoCodec, WebEgressRequest, WebhookEvent, WebhookReceiver, authorizeHeader, claimsToJwtPayload, trackSourceToString

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/assert.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Assert that condition is truthy or throw error (with message)
 */ function assert(condition, msg) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- we want the implicit conversion to boolean
    if (!condition) {
        throw new Error(msg);
    }
}
const FLOAT32_MAX = 3.4028234663852886e38, FLOAT32_MIN = -3.4028234663852886e38, UINT32_MAX = 0xffffffff, INT32_MAX = 0x7fffffff, INT32_MIN = -0x80000000;
/**
 * Assert a valid signed protobuf 32-bit integer.
 */ function assertInt32(arg) {
    if (typeof arg !== "number") throw new Error("invalid int 32: " + typeof arg);
    if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN) throw new Error("invalid int 32: " + arg); // eslint-disable-line @typescript-eslint/restrict-plus-operands -- we want the implicit conversion to string
}
/**
 * Assert a valid unsigned protobuf 32-bit integer.
 */ function assertUInt32(arg) {
    if (typeof arg !== "number") throw new Error("invalid uint 32: " + typeof arg);
    if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0) throw new Error("invalid uint 32: " + arg); // eslint-disable-line @typescript-eslint/restrict-plus-operands -- we want the implicit conversion to string
}
/**
 * Assert a valid protobuf float value.
 */ function assertFloat32(arg) {
    if (typeof arg !== "number") throw new Error("invalid float 32: " + typeof arg);
    if (!Number.isFinite(arg)) return;
    if (arg > FLOAT32_MAX || arg < FLOAT32_MIN) throw new Error("invalid float 32: " + arg); // eslint-disable-line @typescript-eslint/restrict-plus-operands -- we want the implicit conversion to string
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/enum.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const enumTypeSymbol = Symbol("@bufbuild/protobuf/enum-type");
/**
 * Get reflection information from a generated enum.
 * If this function is called on something other than a generated
 * enum, it raises an error.
 */ function getEnumType(enumObject) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
    const t = enumObject[enumTypeSymbol];
    assert(t, "missing enum type on enum object");
    return t; // eslint-disable-line @typescript-eslint/no-unsafe-return
}
/**
 * Sets reflection information on a generated enum.
 */ function setEnumType(enumObject, typeName, values, opt) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    enumObject[enumTypeSymbol] = makeEnumType(typeName, values.map((v)=>({
            no: v.no,
            name: v.name,
            localName: enumObject[v.no]
        })), opt);
}
/**
 * Create a new EnumType with the given values.
 */ function makeEnumType(typeName, values, // eslint-disable-next-line @typescript-eslint/no-unused-vars
_opt) {
    const names = Object.create(null);
    const numbers = Object.create(null);
    const normalValues = [];
    for (const value of values){
        // We do not surface options at this time
        // const value: EnumValueInfo = {...v, options: v.options ?? emptyReadonlyObject};
        const n = normalizeEnumValue(value);
        normalValues.push(n);
        names[value.name] = n;
        numbers[value.no] = n;
    }
    return {
        typeName,
        values: normalValues,
        // We do not surface options at this time
        // options: opt?.options ?? Object.create(null),
        findName (name) {
            return names[name];
        },
        findNumber (no) {
            return numbers[no];
        }
    };
}
/**
 * Create a new enum object with the given values.
 * Sets reflection information.
 */ function makeEnum(typeName, values, opt) {
    const enumObject = {};
    for (const value of values){
        const n = normalizeEnumValue(value);
        enumObject[n.localName] = n.no;
        enumObject[n.no] = n.localName;
    }
    setEnumType(enumObject, typeName, values, opt);
    return enumObject;
}
function normalizeEnumValue(value) {
    if ("localName" in value) {
        return value;
    }
    return Object.assign(Object.assign({}, value), {
        localName: value.name
    });
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/message.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Message is the base class of every message, generated, or created at
 * runtime.
 *
 * It is _not_ safe to extend this class. If you want to create a message at
 * run time, use proto3.makeMessageType().
 */ class Message {
    /**
     * Compare with a message of the same type.
     * Note that this function disregards extensions and unknown fields.
     */ equals(other) {
        return this.getType().runtime.util.equals(this.getType(), this, other);
    }
    /**
     * Create a deep copy.
     */ clone() {
        return this.getType().runtime.util.clone(this);
    }
    /**
     * Parse from binary data, merging fields.
     *
     * Repeated fields are appended. Map entries are added, overwriting
     * existing keys.
     *
     * If a message field is already present, it will be merged with the
     * new data.
     */ fromBinary(bytes, options) {
        const type = this.getType(), format = type.runtime.bin, opt = format.makeReadOptions(options);
        format.readMessage(this, opt.readerFactory(bytes), bytes.byteLength, opt);
        return this;
    }
    /**
     * Parse a message from a JSON value.
     */ fromJson(jsonValue, options) {
        const type = this.getType(), format = type.runtime.json, opt = format.makeReadOptions(options);
        format.readMessage(type, jsonValue, opt, this);
        return this;
    }
    /**
     * Parse a message from a JSON string.
     */ fromJsonString(jsonString, options) {
        let json;
        try {
            json = JSON.parse(jsonString);
        } catch (e) {
            throw new Error(`cannot decode ${this.getType().typeName} from JSON: ${e instanceof Error ? e.message : String(e)}`);
        }
        return this.fromJson(json, options);
    }
    /**
     * Serialize the message to binary data.
     */ toBinary(options) {
        const type = this.getType(), bin = type.runtime.bin, opt = bin.makeWriteOptions(options), writer = opt.writerFactory();
        bin.writeMessage(this, writer, opt);
        return writer.finish();
    }
    /**
     * Serialize the message to a JSON value, a JavaScript value that can be
     * passed to JSON.stringify().
     */ toJson(options) {
        const type = this.getType(), json = type.runtime.json, opt = json.makeWriteOptions(options);
        return json.writeMessage(this, opt);
    }
    /**
     * Serialize the message to a JSON string.
     */ toJsonString(options) {
        var _a;
        const value = this.toJson(options);
        return JSON.stringify(value, null, (_a = options === null || options === void 0 ? void 0 : options.prettySpaces) !== null && _a !== void 0 ? _a : 0);
    }
    /**
     * Override for serialization behavior. This will be invoked when calling
     * JSON.stringify on this message (i.e. JSON.stringify(msg)).
     *
     * Note that this will not serialize google.protobuf.Any with a packed
     * message because the protobuf JSON format specifies that it needs to be
     * unpacked, and this is only possible with a type registry to look up the
     * message type.  As a result, attempting to serialize a message with this
     * type will throw an Error.
     *
     * This method is protected because you should not need to invoke it
     * directly -- instead use JSON.stringify or toJsonString for
     * stringified JSON.  Alternatively, if actual JSON is desired, you should
     * use toJson.
     */ toJSON() {
        return this.toJson({
            emitDefaultValues: true
        });
    }
    /**
     * Retrieve the MessageType of this message - a singleton that represents
     * the protobuf message declaration and provides metadata for reflection-
     * based operations.
     */ getType() {
        // Any class that extends Message _must_ provide a complete static
        // implementation of MessageType.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
        return Object.getPrototypeOf(this).constructor;
    }
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/message-type.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Create a new message type using the given runtime.
 */ function makeMessageType(runtime, typeName, fields, opt) {
    var _a;
    const localName = (_a = opt === null || opt === void 0 ? void 0 : opt.localName) !== null && _a !== void 0 ? _a : typeName.substring(typeName.lastIndexOf(".") + 1);
    const type = {
        [localName]: function(data) {
            runtime.util.initFields(this);
            runtime.util.initPartial(data, this);
        }
    }[localName];
    Object.setPrototypeOf(type.prototype, new Message());
    Object.assign(type, {
        runtime,
        typeName,
        fields: runtime.util.newFieldList(fields),
        fromBinary (bytes, options) {
            return new type().fromBinary(bytes, options);
        },
        fromJson (jsonValue, options) {
            return new type().fromJson(jsonValue, options);
        },
        fromJsonString (jsonString, options) {
            return new type().fromJsonString(jsonString, options);
        },
        equals (a, b) {
            return runtime.util.equals(type, a, b);
        }
    });
    return type;
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/google/varint.js
// Copyright 2008 Google Inc.  All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
// * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// Code generated by the Protocol Buffer compiler is owned by the owner
// of the input file used when generating it.  This code is not
// standalone and requires a support library to be linked with it.  This
// support library is itself covered by the above license.
/* eslint-disable prefer-const,@typescript-eslint/restrict-plus-operands */ /**
 * Read a 64 bit varint as two JS numbers.
 *
 * Returns tuple:
 * [0]: low bits
 * [1]: high bits
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L175
 */ function varint64read() {
    let lowBits = 0;
    let highBits = 0;
    for(let shift = 0; shift < 28; shift += 7){
        let b = this.buf[this.pos++];
        lowBits |= (b & 0x7f) << shift;
        if ((b & 0x80) == 0) {
            this.assertBounds();
            return [
                lowBits,
                highBits
            ];
        }
    }
    let middleByte = this.buf[this.pos++];
    // last four bits of the first 32 bit number
    lowBits |= (middleByte & 0x0f) << 28;
    // 3 upper bits are part of the next 32 bit number
    highBits = (middleByte & 0x70) >> 4;
    if ((middleByte & 0x80) == 0) {
        this.assertBounds();
        return [
            lowBits,
            highBits
        ];
    }
    for(let shift = 3; shift <= 31; shift += 7){
        let b = this.buf[this.pos++];
        highBits |= (b & 0x7f) << shift;
        if ((b & 0x80) == 0) {
            this.assertBounds();
            return [
                lowBits,
                highBits
            ];
        }
    }
    throw new Error("invalid varint");
}
/**
 * Write a 64 bit varint, given as two JS numbers, to the given bytes array.
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/writer.js#L344
 */ function varint64write(lo, hi, bytes) {
    for(let i = 0; i < 28; i = i + 7){
        const shift = lo >>> i;
        const hasNext = !(shift >>> 7 == 0 && hi == 0);
        const byte = (hasNext ? shift | 0x80 : shift) & 0xff;
        bytes.push(byte);
        if (!hasNext) {
            return;
        }
    }
    const splitBits = lo >>> 28 & 0x0f | (hi & 0x07) << 4;
    const hasMoreBits = !(hi >> 3 == 0);
    bytes.push((hasMoreBits ? splitBits | 0x80 : splitBits) & 0xff);
    if (!hasMoreBits) {
        return;
    }
    for(let i = 3; i < 31; i = i + 7){
        const shift = hi >>> i;
        const hasNext = !(shift >>> 7 == 0);
        const byte = (hasNext ? shift | 0x80 : shift) & 0xff;
        bytes.push(byte);
        if (!hasNext) {
            return;
        }
    }
    bytes.push(hi >>> 31 & 0x01);
}
// constants for binary math
const TWO_PWR_32_DBL = 0x100000000;
/**
 * Parse decimal string of 64 bit integer value as two JS numbers.
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
 */ function int64FromString(dec) {
    // Check for minus sign.
    const minus = dec[0] === "-";
    if (minus) {
        dec = dec.slice(1);
    }
    // Work 6 decimal digits at a time, acting like we're converting base 1e6
    // digits to binary. This is safe to do with floating point math because
    // Number.isSafeInteger(ALL_32_BITS * 1e6) == true.
    const base = 1e6;
    let lowBits = 0;
    let highBits = 0;
    function add1e6digit(begin, end) {
        // Note: Number('') is 0.
        const digit1e6 = Number(dec.slice(begin, end));
        highBits *= base;
        lowBits = lowBits * base + digit1e6;
        // Carry bits from lowBits to
        if (lowBits >= TWO_PWR_32_DBL) {
            highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
            lowBits = lowBits % TWO_PWR_32_DBL;
        }
    }
    add1e6digit(-24, -18);
    add1e6digit(-18, -12);
    add1e6digit(-12, -6);
    add1e6digit(-6);
    return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
}
/**
 * Losslessly converts a 64-bit signed integer in 32:32 split representation
 * into a decimal string.
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
 */ function int64ToString(lo, hi) {
    let bits = newBits(lo, hi);
    // If we're treating the input as a signed value and the high bit is set, do
    // a manual two's complement conversion before the decimal conversion.
    const negative = bits.hi & 0x80000000;
    if (negative) {
        bits = negate(bits.lo, bits.hi);
    }
    const result = uInt64ToString(bits.lo, bits.hi);
    return negative ? "-" + result : result;
}
/**
 * Losslessly converts a 64-bit unsigned integer in 32:32 split representation
 * into a decimal string.
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
 */ function uInt64ToString(lo, hi) {
    ({ lo, hi } = toUnsigned(lo, hi));
    // Skip the expensive conversion if the number is small enough to use the
    // built-in conversions.
    // Number.MAX_SAFE_INTEGER = 0x001FFFFF FFFFFFFF, thus any number with
    // highBits <= 0x1FFFFF can be safely expressed with a double and retain
    // integer precision.
    // Proven by: Number.isSafeInteger(0x1FFFFF * 2**32 + 0xFFFFFFFF) == true.
    if (hi <= 0x1FFFFF) {
        return String(TWO_PWR_32_DBL * hi + lo);
    }
    // What this code is doing is essentially converting the input number from
    // base-2 to base-1e7, which allows us to represent the 64-bit range with
    // only 3 (very large) digits. Those digits are then trivial to convert to
    // a base-10 string.
    // The magic numbers used here are -
    // 2^24 = 16777216 = (1,6777216) in base-1e7.
    // 2^48 = 281474976710656 = (2,8147497,6710656) in base-1e7.
    // Split 32:32 representation into 16:24:24 representation so our
    // intermediate digits don't overflow.
    const low = lo & 0xFFFFFF;
    const mid = (lo >>> 24 | hi << 8) & 0xFFFFFF;
    const high = hi >> 16 & 0xFFFF;
    // Assemble our three base-1e7 digits, ignoring carries. The maximum
    // value in a digit at this step is representable as a 48-bit integer, which
    // can be stored in a 64-bit floating point number.
    let digitA = low + mid * 6777216 + high * 6710656;
    let digitB = mid + high * 8147497;
    let digitC = high * 2;
    // Apply carries from A to B and from B to C.
    const base = 10000000;
    if (digitA >= base) {
        digitB += Math.floor(digitA / base);
        digitA %= base;
    }
    if (digitB >= base) {
        digitC += Math.floor(digitB / base);
        digitB %= base;
    }
    // If digitC is 0, then we should have returned in the trivial code path
    // at the top for non-safe integers. Given this, we can assume both digitB
    // and digitA need leading zeros.
    return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) + decimalFrom1e7WithLeadingZeros(digitA);
}
function toUnsigned(lo, hi) {
    return {
        lo: lo >>> 0,
        hi: hi >>> 0
    };
}
function newBits(lo, hi) {
    return {
        lo: lo | 0,
        hi: hi | 0
    };
}
/**
 * Returns two's compliment negation of input.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Signed_32-bit_integers
 */ function negate(lowBits, highBits) {
    highBits = ~highBits;
    if (lowBits) {
        lowBits = ~lowBits + 1;
    } else {
        // If lowBits is 0, then bitwise-not is 0xFFFFFFFF,
        // adding 1 to that, results in 0x100000000, which leaves
        // the low bits 0x0 and simply adds one to the high bits.
        highBits += 1;
    }
    return newBits(lowBits, highBits);
}
/**
 * Returns decimal representation of digit1e7 with leading zeros.
 */ const decimalFrom1e7WithLeadingZeros = (digit1e7)=>{
    const partial = String(digit1e7);
    return "0000000".slice(partial.length) + partial;
};
/**
 * Write a 32 bit varint, signed or unsigned. Same as `varint64write(0, value, bytes)`
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/1b18833f4f2a2f681f4e4a25cdf3b0a43115ec26/js/binary/encoder.js#L144
 */ function varint32write(value, bytes) {
    if (value >= 0) {
        // write value as varint 32
        while(value > 0x7f){
            bytes.push(value & 0x7f | 0x80);
            value = value >>> 7;
        }
        bytes.push(value);
    } else {
        for(let i = 0; i < 9; i++){
            bytes.push(value & 127 | 128);
            value = value >> 7;
        }
        bytes.push(1);
    }
}
/**
 * Read an unsigned 32 bit varint.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L220
 */ function varint32read() {
    let b = this.buf[this.pos++];
    let result = b & 0x7f;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 0x7f) << 7;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 0x7f) << 14;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 0x7f) << 21;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    // Extract only last 4 bits
    b = this.buf[this.pos++];
    result |= (b & 0x0f) << 28;
    for(let readBytes = 5; (b & 0x80) !== 0 && readBytes < 10; readBytes++)b = this.buf[this.pos++];
    if ((b & 0x80) != 0) throw new Error("invalid varint");
    this.assertBounds();
    // Result can have 32 bits, convert it to unsigned
    return result >>> 0;
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


function makeInt64Support() {
    const dv = new DataView(new ArrayBuffer(8));
    // note that Safari 14 implements BigInt, but not the DataView methods
    const ok = typeof BigInt === "function" && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function" && (typeof process != "object" || typeof process.env != "object" || process.env.BUF_BIGINT_DISABLE !== "1");
    if (ok) {
        const MIN = BigInt("-9223372036854775808"), MAX = BigInt("9223372036854775807"), UMIN = BigInt("0"), UMAX = BigInt("18446744073709551615");
        return {
            zero: BigInt(0),
            supported: true,
            parse (value) {
                const bi = typeof value == "bigint" ? value : BigInt(value);
                if (bi > MAX || bi < MIN) {
                    throw new Error(`int64 invalid: ${value}`);
                }
                return bi;
            },
            uParse (value) {
                const bi = typeof value == "bigint" ? value : BigInt(value);
                if (bi > UMAX || bi < UMIN) {
                    throw new Error(`uint64 invalid: ${value}`);
                }
                return bi;
            },
            enc (value) {
                dv.setBigInt64(0, this.parse(value), true);
                return {
                    lo: dv.getInt32(0, true),
                    hi: dv.getInt32(4, true)
                };
            },
            uEnc (value) {
                dv.setBigInt64(0, this.uParse(value), true);
                return {
                    lo: dv.getInt32(0, true),
                    hi: dv.getInt32(4, true)
                };
            },
            dec (lo, hi) {
                dv.setInt32(0, lo, true);
                dv.setInt32(4, hi, true);
                return dv.getBigInt64(0, true);
            },
            uDec (lo, hi) {
                dv.setInt32(0, lo, true);
                dv.setInt32(4, hi, true);
                return dv.getBigUint64(0, true);
            }
        };
    }
    const assertInt64String = (value)=>assert(/^-?[0-9]+$/.test(value), `int64 invalid: ${value}`);
    const assertUInt64String = (value)=>assert(/^[0-9]+$/.test(value), `uint64 invalid: ${value}`);
    return {
        zero: "0",
        supported: false,
        parse (value) {
            if (typeof value != "string") {
                value = value.toString();
            }
            assertInt64String(value);
            return value;
        },
        uParse (value) {
            if (typeof value != "string") {
                value = value.toString();
            }
            assertUInt64String(value);
            return value;
        },
        enc (value) {
            if (typeof value != "string") {
                value = value.toString();
            }
            assertInt64String(value);
            return int64FromString(value);
        },
        uEnc (value) {
            if (typeof value != "string") {
                value = value.toString();
            }
            assertUInt64String(value);
            return int64FromString(value);
        },
        dec (lo, hi) {
            return int64ToString(lo, hi);
        },
        uDec (lo, hi) {
            return uInt64ToString(lo, hi);
        }
    };
}
const protoInt64 = makeInt64Support();

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/scalar.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Scalar value types. This is a subset of field types declared by protobuf
 * enum google.protobuf.FieldDescriptorProto.Type The types GROUP and MESSAGE
 * are omitted, but the numerical values are identical.
 */ var ScalarType;
(function(ScalarType) {
    // 0 is reserved for errors.
    // Order is weird for historical reasons.
    ScalarType[ScalarType["DOUBLE"] = 1] = "DOUBLE";
    ScalarType[ScalarType["FLOAT"] = 2] = "FLOAT";
    // Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT64 if
    // negative values are likely.
    ScalarType[ScalarType["INT64"] = 3] = "INT64";
    ScalarType[ScalarType["UINT64"] = 4] = "UINT64";
    // Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT32 if
    // negative values are likely.
    ScalarType[ScalarType["INT32"] = 5] = "INT32";
    ScalarType[ScalarType["FIXED64"] = 6] = "FIXED64";
    ScalarType[ScalarType["FIXED32"] = 7] = "FIXED32";
    ScalarType[ScalarType["BOOL"] = 8] = "BOOL";
    ScalarType[ScalarType["STRING"] = 9] = "STRING";
    // Tag-delimited aggregate.
    // Group type is deprecated and not supported in proto3. However, Proto3
    // implementations should still be able to parse the group wire format and
    // treat group fields as unknown fields.
    // TYPE_GROUP = 10,
    // TYPE_MESSAGE = 11,  // Length-delimited aggregate.
    // New in version 2.
    ScalarType[ScalarType["BYTES"] = 12] = "BYTES";
    ScalarType[ScalarType["UINT32"] = 13] = "UINT32";
    // TYPE_ENUM = 14,
    ScalarType[ScalarType["SFIXED32"] = 15] = "SFIXED32";
    ScalarType[ScalarType["SFIXED64"] = 16] = "SFIXED64";
    ScalarType[ScalarType["SINT32"] = 17] = "SINT32";
    ScalarType[ScalarType["SINT64"] = 18] = "SINT64";
})(ScalarType || (ScalarType = {}));
/**
 * JavaScript representation of fields with 64 bit integral types (int64, uint64,
 * sint64, fixed64, sfixed64).
 *
 * This is a subset of google.protobuf.FieldOptions.JSType, which defines JS_NORMAL,
 * JS_STRING, and JS_NUMBER. Protobuf-ES uses BigInt by default, but will use
 * String if `[jstype = JS_STRING]` is specified.
 *
 * ```protobuf
 * uint64 field_a = 1; // BigInt
 * uint64 field_b = 2 [jstype = JS_NORMAL]; // BigInt
 * uint64 field_b = 2 [jstype = JS_NUMBER]; // BigInt
 * uint64 field_b = 2 [jstype = JS_STRING]; // String
 * ```
 */ var LongType;
(function(LongType) {
    /**
     * Use JavaScript BigInt.
     */ LongType[LongType["BIGINT"] = 0] = "BIGINT";
    /**
     * Use JavaScript String.
     *
     * Field option `[jstype = JS_STRING]`.
     */ LongType[LongType["STRING"] = 1] = "STRING";
})(LongType || (LongType = {}));

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/scalars.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * Returns true if both scalar values are equal.
 */ function scalarEquals(type, a, b) {
    if (a === b) {
        // This correctly matches equal values except BYTES and (possibly) 64-bit integers.
        return true;
    }
    // Special case BYTES - we need to compare each byte individually
    if (type == ScalarType.BYTES) {
        if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }
        for(let i = 0; i < a.length; i++){
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
    // Special case 64-bit integers - we support number, string and bigint representation.
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch(type){
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
            // Loose comparison will match between 0n, 0 and "0".
            return a == b;
    }
    // Anything that hasn't been caught by strict comparison or special cased
    // BYTES and 64-bit integers is not equal.
    return false;
}
/**
 * Returns the zero value for the given scalar type.
 */ function scalarZeroValue(type, longType) {
    switch(type){
        case ScalarType.BOOL:
            return false;
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
            // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- acceptable since it's covered by tests
            return longType == 0 ? protoInt64.zero : "0";
        case ScalarType.DOUBLE:
        case ScalarType.FLOAT:
            return 0.0;
        case ScalarType.BYTES:
            return new Uint8Array(0);
        case ScalarType.STRING:
            return "";
        default:
            // Handles INT32, UINT32, SINT32, FIXED32, SFIXED32.
            // We do not use individual cases to save a few bytes code size.
            return 0;
    }
}
/**
 * Returns true for a zero-value. For example, an integer has the zero-value `0`,
 * a boolean is `false`, a string is `""`, and bytes is an empty Uint8Array.
 *
 * In proto3, zero-values are not written to the wire, unless the field is
 * optional or repeated.
 */ function isScalarZeroValue(type, value) {
    switch(type){
        case ScalarType.BOOL:
            return value === false;
        case ScalarType.STRING:
            return value === "";
        case ScalarType.BYTES:
            return value instanceof Uint8Array && !value.byteLength;
        default:
            return value == 0; // Loose comparison matches 0n, 0 and "0"
    }
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/extensions.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * Create a new extension using the given runtime.
 */ function makeExtension(runtime, typeName, extendee, field) {
    let fi;
    return {
        typeName,
        extendee,
        get field () {
            if (!fi) {
                const i = typeof field == "function" ? field() : field;
                i.name = typeName.split(".").pop();
                i.jsonName = `[${typeName}]`;
                fi = runtime.util.newFieldList([
                    i
                ]).list()[0];
            }
            return fi;
        },
        runtime
    };
}
/**
 * Create a container that allows us to read extension fields into it with the
 * same logic as regular fields.
 */ function createExtensionContainer(extension) {
    const localName = extension.field.localName;
    const container = Object.create(null);
    container[localName] = initExtensionField(extension);
    return [
        container,
        ()=>container[localName]
    ];
}
function initExtensionField(ext) {
    const field = ext.field;
    if (field.repeated) {
        return [];
    }
    if (field.default !== undefined) {
        return field.default;
    }
    switch(field.kind){
        case "enum":
            return field.T.values[0].no;
        case "scalar":
            return scalarZeroValue(field.T, field.L);
        case "message":
            // eslint-disable-next-line no-case-declarations
            const T = field.T, value = new T();
            return T.fieldWrapper ? T.fieldWrapper.unwrapField(value) : value;
        case "map":
            throw "map fields are not allowed to be extensions";
    }
}
/**
 * Helper to filter unknown fields, optimized based on field type.
 */ function filterUnknownFields(unknownFields, field) {
    if (!field.repeated && (field.kind == "enum" || field.kind == "scalar")) {
        // singular scalar fields do not merge, we pick the last
        for(let i = unknownFields.length - 1; i >= 0; --i){
            if (unknownFields[i].no == field.no) {
                return [
                    unknownFields[i]
                ];
            }
        }
        return [];
    }
    return unknownFields.filter((uf)=>uf.no === field.no);
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/proto-base64.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unnecessary-condition, prefer-const */ // lookup table from base64 character to byte
let encTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
// lookup table from base64 character *code* to byte because lookup by number is fast
let decTable = [];
for(let i = 0; i < encTable.length; i++)decTable[encTable[i].charCodeAt(0)] = i;
// support base64url variants
decTable["-".charCodeAt(0)] = encTable.indexOf("+");
decTable["_".charCodeAt(0)] = encTable.indexOf("/");
const protoBase64 = {
    /**
     * Decodes a base64 string to a byte array.
     *
     * - ignores white-space, including line breaks and tabs
     * - allows inner padding (can decode concatenated base64 strings)
     * - does not require padding
     * - understands base64url encoding:
     *   "-" instead of "+",
     *   "_" instead of "/",
     *   no padding
     */ dec (base64Str) {
        // estimate byte size, not accounting for inner padding and whitespace
        let es = base64Str.length * 3 / 4;
        if (base64Str[base64Str.length - 2] == "=") es -= 2;
        else if (base64Str[base64Str.length - 1] == "=") es -= 1;
        let bytes = new Uint8Array(es), bytePos = 0, groupPos = 0, b, p = 0; // previous byte
        for(let i = 0; i < base64Str.length; i++){
            b = decTable[base64Str.charCodeAt(i)];
            if (b === undefined) {
                switch(base64Str[i]){
                    // @ts-ignore TS7029: Fallthrough case in switch
                    case "=":
                        groupPos = 0; // reset state when padding found
                    // @ts-ignore TS7029: Fallthrough case in switch
                    case "\n":
                    case "\r":
                    case "	":
                    case " ":
                        continue; // skip white-space, and padding
                    default:
                        throw Error("invalid base64 string.");
                }
            }
            switch(groupPos){
                case 0:
                    p = b;
                    groupPos = 1;
                    break;
                case 1:
                    bytes[bytePos++] = p << 2 | (b & 48) >> 4;
                    p = b;
                    groupPos = 2;
                    break;
                case 2:
                    bytes[bytePos++] = (p & 15) << 4 | (b & 60) >> 2;
                    p = b;
                    groupPos = 3;
                    break;
                case 3:
                    bytes[bytePos++] = (p & 3) << 6 | b;
                    groupPos = 0;
                    break;
            }
        }
        if (groupPos == 1) throw Error("invalid base64 string.");
        return bytes.subarray(0, bytePos);
    },
    /**
     * Encode a byte array to a base64 string.
     */ enc (bytes) {
        let base64 = "", groupPos = 0, b, p = 0; // carry over from previous byte
        for(let i = 0; i < bytes.length; i++){
            b = bytes[i];
            switch(groupPos){
                case 0:
                    base64 += encTable[b >> 2];
                    p = (b & 3) << 4;
                    groupPos = 1;
                    break;
                case 1:
                    base64 += encTable[p | b >> 4];
                    p = (b & 15) << 2;
                    groupPos = 2;
                    break;
                case 2:
                    base64 += encTable[p | b >> 6];
                    base64 += encTable[b & 63];
                    groupPos = 0;
                    break;
            }
        }
        // add output padding
        if (groupPos) {
            base64 += encTable[p];
            base64 += "=";
            if (groupPos == 1) base64 += "=";
        }
        return base64;
    }
};

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/extension-accessor.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * Retrieve an extension value from a message.
 *
 * The function never returns undefined. Use hasExtension() to check whether an
 * extension is set. If the extension is not set, this function returns the
 * default value (if one was specified in the protobuf source), or the zero value
 * (for example `0` for numeric types, `[]` for repeated extension fields, and
 * an empty message instance for message fields).
 *
 * Extensions are stored as unknown fields on a message. To mutate an extension
 * value, make sure to store the new value with setExtension() after mutating.
 *
 * If the extension does not extend the given message, an error is raised.
 */ function getExtension(message, extension, options) {
    assertExtendee(extension, message);
    const opt = extension.runtime.bin.makeReadOptions(options);
    const ufs = filterUnknownFields(message.getType().runtime.bin.listUnknownFields(message), extension.field);
    const [container, get] = createExtensionContainer(extension);
    for (const uf of ufs){
        extension.runtime.bin.readField(container, opt.readerFactory(uf.data), extension.field, uf.wireType, opt);
    }
    return get();
}
/**
 * Set an extension value on a message. If the message already has a value for
 * this extension, the value is replaced.
 *
 * If the extension does not extend the given message, an error is raised.
 */ function setExtension(message, extension, value, options) {
    assertExtendee(extension, message);
    const readOpt = extension.runtime.bin.makeReadOptions(options);
    const writeOpt = extension.runtime.bin.makeWriteOptions(options);
    if (hasExtension(message, extension)) {
        const ufs = message.getType().runtime.bin.listUnknownFields(message).filter((uf)=>uf.no != extension.field.no);
        message.getType().runtime.bin.discardUnknownFields(message);
        for (const uf of ufs){
            message.getType().runtime.bin.onUnknownField(message, uf.no, uf.wireType, uf.data);
        }
    }
    const writer = writeOpt.writerFactory();
    let f = extension.field;
    // Implicit presence does not apply to extensions, see https://github.com/protocolbuffers/protobuf/issues/8234
    // We patch the field info to use explicit presence:
    if (!f.opt && !f.repeated && (f.kind == "enum" || f.kind == "scalar")) {
        f = Object.assign(Object.assign({}, extension.field), {
            opt: true
        });
    }
    extension.runtime.bin.writeField(f, value, writer, writeOpt);
    const reader = readOpt.readerFactory(writer.finish());
    while(reader.pos < reader.len){
        const [no, wireType] = reader.tag();
        const data = reader.skip(wireType, no);
        message.getType().runtime.bin.onUnknownField(message, no, wireType, data);
    }
}
/**
 * Remove an extension value from a message.
 *
 * If the extension does not extend the given message, an error is raised.
 */ function clearExtension(message, extension) {
    assertExtendee(extension, message);
    if (hasExtension(message, extension)) {
        const bin = message.getType().runtime.bin;
        const ufs = bin.listUnknownFields(message).filter((uf)=>uf.no != extension.field.no);
        bin.discardUnknownFields(message);
        for (const uf of ufs){
            bin.onUnknownField(message, uf.no, uf.wireType, uf.data);
        }
    }
}
/**
 * Check whether an extension is set on a message.
 */ function hasExtension(message, extension) {
    const messageType = message.getType();
    return extension.extendee.typeName === messageType.typeName && !!messageType.runtime.bin.listUnknownFields(message).find((uf)=>uf.no == extension.field.no);
}
function assertExtendee(extension, message) {
    assert(extension.extendee.typeName == message.getType().typeName, `extension ${extension.typeName} can only be applied to message ${extension.extendee.typeName}`);
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/reflect.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Returns true if the field is set.
 */ function isFieldSet(field, target) {
    const localName = field.localName;
    if (field.repeated) {
        return target[localName].length > 0;
    }
    if (field.oneof) {
        return target[field.oneof.localName].case === localName; // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    }
    switch(field.kind){
        case "enum":
        case "scalar":
            if (field.opt || field.req) {
                // explicit presence
                return target[localName] !== undefined;
            }
            // implicit presence
            if (field.kind == "enum") {
                return target[localName] !== field.T.values[0].no;
            }
            return !isScalarZeroValue(field.T, target[localName]);
        case "message":
            return target[localName] !== undefined;
        case "map":
            return Object.keys(target[localName]).length > 0; // eslint-disable-line @typescript-eslint/no-unsafe-argument
    }
}
/**
 * Resets the field, so that isFieldSet() will return false.
 */ function clearField(field, target) {
    const localName = field.localName;
    const implicitPresence = !field.opt && !field.req;
    if (field.repeated) {
        target[localName] = [];
    } else if (field.oneof) {
        target[field.oneof.localName] = {
            case: undefined
        };
    } else {
        switch(field.kind){
            case "map":
                target[localName] = {};
                break;
            case "enum":
                target[localName] = implicitPresence ? field.T.values[0].no : undefined;
                break;
            case "scalar":
                target[localName] = implicitPresence ? scalarZeroValue(field.T, field.L) : undefined;
                break;
            case "message":
                target[localName] = undefined;
                break;
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/is-message.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Check whether the given object is any subtype of Message or is a specific
 * Message by passing the type.
 *
 * Just like `instanceof`, `isMessage` narrows the type. The advantage of
 * `isMessage` is that it compares identity by the message type name, not by
 * class identity. This makes it robust against the dual package hazard and
 * similar situations, where the same message is duplicated.
 *
 * This function is _mostly_ equivalent to the `instanceof` operator. For
 * example, `isMessage(foo, MyMessage)` is the same as `foo instanceof MyMessage`,
 * and `isMessage(foo)` is the same as `foo instanceof Message`. In most cases,
 * `isMessage` should be preferred over `instanceof`.
 *
 * However, due to the fact that `isMessage` does not use class identity, there
 * are subtle differences between this function and `instanceof`. Notably,
 * calling `isMessage` on an explicit type of Message will return false.
 */ function isMessage(arg, type) {
    if (arg === null || typeof arg != "object") {
        return false;
    }
    if (!Object.getOwnPropertyNames(Message.prototype).every((m)=>m in arg && typeof arg[m] == "function")) {
        return false;
    }
    const actualType = arg.getType();
    if (actualType === null || typeof actualType != "function" || !("typeName" in actualType) || typeof actualType.typeName != "string") {
        return false;
    }
    return type === undefined ? true : actualType.typeName == type.typeName;
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/field-wrapper.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/**
 * Wrap a primitive message field value in its corresponding wrapper
 * message. This function is idempotent.
 */ function wrapField(type, value) {
    if (isMessage(value) || !type.fieldWrapper) {
        return value;
    }
    return type.fieldWrapper.wrapField(value);
}
/**
 * If the given field uses one of the well-known wrapper types, return
 * the primitive type it wraps.
 */ function getUnwrappedFieldType(field) {
    if (field.fieldKind !== "message") {
        return undefined;
    }
    if (field.repeated) {
        return undefined;
    }
    if (field.oneof != undefined) {
        return undefined;
    }
    return wktWrapperToScalarType[field.message.typeName];
}
const wktWrapperToScalarType = {
    "google.protobuf.DoubleValue": ScalarType.DOUBLE,
    "google.protobuf.FloatValue": ScalarType.FLOAT,
    "google.protobuf.Int64Value": ScalarType.INT64,
    "google.protobuf.UInt64Value": ScalarType.UINT64,
    "google.protobuf.Int32Value": ScalarType.INT32,
    "google.protobuf.UInt32Value": ScalarType.UINT32,
    "google.protobuf.BoolValue": ScalarType.BOOL,
    "google.protobuf.StringValue": ScalarType.STRING,
    "google.protobuf.BytesValue": ScalarType.BYTES
};

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/json-format.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.












/* eslint-disable no-case-declarations,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */ // Default options for parsing JSON.
const jsonReadDefaults = {
    ignoreUnknownFields: false
};
// Default options for serializing to JSON.
const jsonWriteDefaults = {
    emitDefaultValues: false,
    enumAsInteger: false,
    useProtoFieldName: false,
    prettySpaces: 0
};
function makeReadOptions(options) {
    return options ? Object.assign(Object.assign({}, jsonReadDefaults), options) : jsonReadDefaults;
}
function makeWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, jsonWriteDefaults), options) : jsonWriteDefaults;
}
const tokenNull = Symbol();
const tokenIgnoredUnknownEnum = Symbol();
function makeJsonFormat() {
    return {
        makeReadOptions,
        makeWriteOptions,
        readMessage (type, json, options, message) {
            if (json == null || Array.isArray(json) || typeof json != "object") {
                throw new Error(`cannot decode message ${type.typeName} from JSON: ${debugJsonValue(json)}`);
            }
            message = message !== null && message !== void 0 ? message : new type();
            const oneofSeen = new Map();
            const registry = options.typeRegistry;
            for (const [jsonKey, jsonValue] of Object.entries(json)){
                const field = type.fields.findJsonName(jsonKey);
                if (field) {
                    if (field.oneof) {
                        if (jsonValue === null && field.kind == "scalar") {
                            continue;
                        }
                        const seen = oneofSeen.get(field.oneof);
                        if (seen !== undefined) {
                            throw new Error(`cannot decode message ${type.typeName} from JSON: multiple keys for oneof "${field.oneof.name}" present: "${seen}", "${jsonKey}"`);
                        }
                        oneofSeen.set(field.oneof, jsonKey);
                    }
                    readField(message, jsonValue, field, options, type);
                } else {
                    let found = false;
                    if ((registry === null || registry === void 0 ? void 0 : registry.findExtension) && jsonKey.startsWith("[") && jsonKey.endsWith("]")) {
                        const ext = registry.findExtension(jsonKey.substring(1, jsonKey.length - 1));
                        if (ext && ext.extendee.typeName == type.typeName) {
                            found = true;
                            const [container, get] = createExtensionContainer(ext);
                            readField(container, jsonValue, ext.field, options, ext);
                            // We pass on the options as BinaryReadOptions/BinaryWriteOptions,
                            // so that users can bring their own binary reader and writer factories
                            // if necessary.
                            setExtension(message, ext, get(), options);
                        }
                    }
                    if (!found && !options.ignoreUnknownFields) {
                        throw new Error(`cannot decode message ${type.typeName} from JSON: key "${jsonKey}" is unknown`);
                    }
                }
            }
            return message;
        },
        writeMessage (message, options) {
            const type = message.getType();
            const json = {};
            let field;
            try {
                for (field of type.fields.byNumber()){
                    if (!isFieldSet(field, message)) {
                        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                        if (field.req) {
                            throw `required field not set`;
                        }
                        if (!options.emitDefaultValues) {
                            continue;
                        }
                        if (!canEmitFieldDefaultValue(field)) {
                            continue;
                        }
                    }
                    const value = field.oneof ? message[field.oneof.localName].value : message[field.localName];
                    const jsonValue = writeField(field, value, options);
                    if (jsonValue !== undefined) {
                        json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue;
                    }
                }
                const registry = options.typeRegistry;
                if (registry === null || registry === void 0 ? void 0 : registry.findExtensionFor) {
                    for (const uf of type.runtime.bin.listUnknownFields(message)){
                        const ext = registry.findExtensionFor(type.typeName, uf.no);
                        if (ext && hasExtension(message, ext)) {
                            // We pass on the options as BinaryReadOptions, so that users can bring their own
                            // binary reader factory if necessary.
                            const value = getExtension(message, ext, options);
                            const jsonValue = writeField(ext.field, value, options);
                            if (jsonValue !== undefined) {
                                json[ext.field.jsonName] = jsonValue;
                            }
                        }
                    }
                }
            } catch (e) {
                const m = field ? `cannot encode field ${type.typeName}.${field.name} to JSON` : `cannot encode message ${type.typeName} to JSON`;
                const r = e instanceof Error ? e.message : String(e);
                throw new Error(m + (r.length > 0 ? `: ${r}` : ""));
            }
            return json;
        },
        readScalar (type, json, longType) {
            // The signature of our internal function has changed. For backwards-
            // compatibility, we support the old form that is part of the public API
            // through the interface JsonFormat.
            return readScalar(type, json, longType !== null && longType !== void 0 ? longType : LongType.BIGINT, true);
        },
        writeScalar (type, value, emitDefaultValues) {
            // The signature of our internal function has changed. For backwards-
            // compatibility, we support the old form that is part of the public API
            // through the interface JsonFormat.
            if (value === undefined) {
                return undefined;
            }
            if (emitDefaultValues || isScalarZeroValue(type, value)) {
                return writeScalar(type, value);
            }
            return undefined;
        },
        debug: debugJsonValue
    };
}
function debugJsonValue(json) {
    if (json === null) {
        return "null";
    }
    switch(typeof json){
        case "object":
            return Array.isArray(json) ? "array" : "object";
        case "string":
            return json.length > 100 ? "string" : `"${json.split('"').join('\\"')}"`;
        default:
            return String(json);
    }
}
// Read a JSON value for a field.
// The "parentType" argument is only used to provide context in errors.
function readField(target, jsonValue, field, options, parentType) {
    let localName = field.localName;
    if (field.repeated) {
        assert(field.kind != "map");
        if (jsonValue === null) {
            return;
        }
        if (!Array.isArray(jsonValue)) {
            throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`);
        }
        const targetArray = target[localName];
        for (const jsonItem of jsonValue){
            if (jsonItem === null) {
                throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonItem)}`);
            }
            switch(field.kind){
                case "message":
                    targetArray.push(field.T.fromJson(jsonItem, options));
                    break;
                case "enum":
                    const enumValue = readEnum(field.T, jsonItem, options.ignoreUnknownFields, true);
                    if (enumValue !== tokenIgnoredUnknownEnum) {
                        targetArray.push(enumValue);
                    }
                    break;
                case "scalar":
                    try {
                        targetArray.push(readScalar(field.T, jsonItem, field.L, true));
                    } catch (e) {
                        let m = `cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonItem)}`;
                        if (e instanceof Error && e.message.length > 0) {
                            m += `: ${e.message}`;
                        }
                        throw new Error(m);
                    }
                    break;
            }
        }
    } else if (field.kind == "map") {
        if (jsonValue === null) {
            return;
        }
        if (typeof jsonValue != "object" || Array.isArray(jsonValue)) {
            throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`);
        }
        const targetMap = target[localName];
        for (const [jsonMapKey, jsonMapValue] of Object.entries(jsonValue)){
            if (jsonMapValue === null) {
                throw new Error(`cannot decode field ${parentType.typeName}.${field.name} from JSON: map value null`);
            }
            let key;
            try {
                key = readMapKey(field.K, jsonMapKey);
            } catch (e) {
                let m = `cannot decode map key for field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
                if (e instanceof Error && e.message.length > 0) {
                    m += `: ${e.message}`;
                }
                throw new Error(m);
            }
            switch(field.V.kind){
                case "message":
                    targetMap[key] = field.V.T.fromJson(jsonMapValue, options);
                    break;
                case "enum":
                    const enumValue = readEnum(field.V.T, jsonMapValue, options.ignoreUnknownFields, true);
                    if (enumValue !== tokenIgnoredUnknownEnum) {
                        targetMap[key] = enumValue;
                    }
                    break;
                case "scalar":
                    try {
                        targetMap[key] = readScalar(field.V.T, jsonMapValue, LongType.BIGINT, true);
                    } catch (e) {
                        let m = `cannot decode map value for field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
                        if (e instanceof Error && e.message.length > 0) {
                            m += `: ${e.message}`;
                        }
                        throw new Error(m);
                    }
                    break;
            }
        }
    } else {
        if (field.oneof) {
            target = target[field.oneof.localName] = {
                case: localName
            };
            localName = "value";
        }
        switch(field.kind){
            case "message":
                const messageType = field.T;
                if (jsonValue === null && messageType.typeName != "google.protobuf.Value") {
                    return;
                }
                let currentValue = target[localName];
                if (isMessage(currentValue)) {
                    currentValue.fromJson(jsonValue, options);
                } else {
                    target[localName] = currentValue = messageType.fromJson(jsonValue, options);
                    if (messageType.fieldWrapper && !field.oneof) {
                        target[localName] = messageType.fieldWrapper.unwrapField(currentValue);
                    }
                }
                break;
            case "enum":
                const enumValue = readEnum(field.T, jsonValue, options.ignoreUnknownFields, false);
                switch(enumValue){
                    case tokenNull:
                        clearField(field, target);
                        break;
                    case tokenIgnoredUnknownEnum:
                        break;
                    default:
                        target[localName] = enumValue;
                        break;
                }
                break;
            case "scalar":
                try {
                    const scalarValue = readScalar(field.T, jsonValue, field.L, false);
                    switch(scalarValue){
                        case tokenNull:
                            clearField(field, target);
                            break;
                        default:
                            target[localName] = scalarValue;
                            break;
                    }
                } catch (e) {
                    let m = `cannot decode field ${parentType.typeName}.${field.name} from JSON: ${debugJsonValue(jsonValue)}`;
                    if (e instanceof Error && e.message.length > 0) {
                        m += `: ${e.message}`;
                    }
                    throw new Error(m);
                }
                break;
        }
    }
}
function readMapKey(type, json) {
    if (type === ScalarType.BOOL) {
        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch(json){
            case "true":
                json = true;
                break;
            case "false":
                json = false;
                break;
        }
    }
    return readScalar(type, json, LongType.BIGINT, true).toString();
}
function readScalar(type, json, longType, nullAsZeroValue) {
    if (json === null) {
        if (nullAsZeroValue) {
            return scalarZeroValue(type, longType);
        }
        return tokenNull;
    }
    // every valid case in the switch below returns, and every fall
    // through is regarded as a failure.
    switch(type){
        // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
        // Either numbers or strings are accepted. Exponent notation is also accepted.
        case ScalarType.DOUBLE:
        case ScalarType.FLOAT:
            if (json === "NaN") return Number.NaN;
            if (json === "Infinity") return Number.POSITIVE_INFINITY;
            if (json === "-Infinity") return Number.NEGATIVE_INFINITY;
            if (json === "") {
                break;
            }
            if (typeof json == "string" && json.trim().length !== json.length) {
                break;
            }
            if (typeof json != "string" && typeof json != "number") {
                break;
            }
            const float = Number(json);
            if (Number.isNaN(float)) {
                break;
            }
            if (!Number.isFinite(float)) {
                break;
            }
            if (type == ScalarType.FLOAT) assertFloat32(float);
            return float;
        // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
        case ScalarType.INT32:
        case ScalarType.FIXED32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
        case ScalarType.UINT32:
            let int32;
            if (typeof json == "number") int32 = json;
            else if (typeof json == "string" && json.length > 0) {
                if (json.trim().length === json.length) int32 = Number(json);
            }
            if (int32 === undefined) break;
            if (type == ScalarType.UINT32 || type == ScalarType.FIXED32) assertUInt32(int32);
            else assertInt32(int32);
            return int32;
        // int64, fixed64, uint64: JSON value will be a decimal string. Either numbers or strings are accepted.
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
            if (typeof json != "number" && typeof json != "string") break;
            const long = protoInt64.parse(json);
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            return longType ? long.toString() : long;
        case ScalarType.FIXED64:
        case ScalarType.UINT64:
            if (typeof json != "number" && typeof json != "string") break;
            const uLong = protoInt64.uParse(json);
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            return longType ? uLong.toString() : uLong;
        // bool:
        case ScalarType.BOOL:
            if (typeof json !== "boolean") break;
            return json;
        // string:
        case ScalarType.STRING:
            if (typeof json !== "string") {
                break;
            }
            // A string must always contain UTF-8 encoded or 7-bit ASCII.
            // We validate with encodeURIComponent, which appears to be the fastest widely available option.
            try {
                encodeURIComponent(json);
            } catch (e) {
                throw new Error("invalid UTF8");
            }
            return json;
        // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
        // Either standard or URL-safe base64 encoding with/without paddings are accepted.
        case ScalarType.BYTES:
            if (json === "") return new Uint8Array(0);
            if (typeof json !== "string") break;
            return protoBase64.dec(json);
    }
    throw new Error();
}
function readEnum(type, json, ignoreUnknownFields, nullAsZeroValue) {
    if (json === null) {
        if (type.typeName == "google.protobuf.NullValue") {
            return 0; // google.protobuf.NullValue.NULL_VALUE = 0
        }
        return nullAsZeroValue ? type.values[0].no : tokenNull;
    }
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch(typeof json){
        case "number":
            if (Number.isInteger(json)) {
                return json;
            }
            break;
        case "string":
            const value = type.findName(json);
            if (value !== undefined) {
                return value.no;
            }
            if (ignoreUnknownFields) {
                return tokenIgnoredUnknownEnum;
            }
            break;
    }
    throw new Error(`cannot decode enum ${type.typeName} from JSON: ${debugJsonValue(json)}`);
}
// Decide whether an unset field should be emitted with JSON write option `emitDefaultValues`
function canEmitFieldDefaultValue(field) {
    if (field.repeated || field.kind == "map") {
        // maps are {}, repeated fields are []
        return true;
    }
    if (field.oneof) {
        // oneof fields are never emitted
        return false;
    }
    if (field.kind == "message") {
        // singular message field are allowed to emit JSON null, but we do not
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (field.opt || field.req) {
        // the field uses explicit presence, so we cannot emit a zero value
        return false;
    }
    return true;
}
function writeField(field, value, options) {
    if (field.kind == "map") {
        assert(typeof value == "object" && value != null);
        const jsonObj = {};
        const entries = Object.entries(value);
        switch(field.V.kind){
            case "scalar":
                for (const [entryKey, entryValue] of entries){
                    jsonObj[entryKey.toString()] = writeScalar(field.V.T, entryValue); // JSON standard allows only (double quoted) string as property key
                }
                break;
            case "message":
                for (const [entryKey, entryValue] of entries){
                    // JSON standard allows only (double quoted) string as property key
                    jsonObj[entryKey.toString()] = entryValue.toJson(options);
                }
                break;
            case "enum":
                const enumType = field.V.T;
                for (const [entryKey, entryValue] of entries){
                    // JSON standard allows only (double quoted) string as property key
                    jsonObj[entryKey.toString()] = writeEnum(enumType, entryValue, options.enumAsInteger);
                }
                break;
        }
        return options.emitDefaultValues || entries.length > 0 ? jsonObj : undefined;
    }
    if (field.repeated) {
        assert(Array.isArray(value));
        const jsonArr = [];
        switch(field.kind){
            case "scalar":
                for(let i = 0; i < value.length; i++){
                    jsonArr.push(writeScalar(field.T, value[i]));
                }
                break;
            case "enum":
                for(let i = 0; i < value.length; i++){
                    jsonArr.push(writeEnum(field.T, value[i], options.enumAsInteger));
                }
                break;
            case "message":
                for(let i = 0; i < value.length; i++){
                    jsonArr.push(value[i].toJson(options));
                }
                break;
        }
        return options.emitDefaultValues || jsonArr.length > 0 ? jsonArr : undefined;
    }
    switch(field.kind){
        case "scalar":
            return writeScalar(field.T, value);
        case "enum":
            return writeEnum(field.T, value, options.enumAsInteger);
        case "message":
            return wrapField(field.T, value).toJson(options);
    }
}
function writeEnum(type, value, enumAsInteger) {
    var _a;
    assert(typeof value == "number");
    if (type.typeName == "google.protobuf.NullValue") {
        return null;
    }
    if (enumAsInteger) {
        return value;
    }
    const val = type.findNumber(value);
    return (_a = val === null || val === void 0 ? void 0 : val.name) !== null && _a !== void 0 ? _a : value; // if we don't know the enum value, just return the number
}
function writeScalar(type, value) {
    switch(type){
        // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
        case ScalarType.INT32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
        case ScalarType.FIXED32:
        case ScalarType.UINT32:
            assert(typeof value == "number");
            return value;
        // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
        // Either numbers or strings are accepted. Exponent notation is also accepted.
        case ScalarType.FLOAT:
        // assertFloat32(value);
        case ScalarType.DOUBLE:
            assert(typeof value == "number");
            if (Number.isNaN(value)) return "NaN";
            if (value === Number.POSITIVE_INFINITY) return "Infinity";
            if (value === Number.NEGATIVE_INFINITY) return "-Infinity";
            return value;
        // string:
        case ScalarType.STRING:
            assert(typeof value == "string");
            return value;
        // bool:
        case ScalarType.BOOL:
            assert(typeof value == "boolean");
            return value;
        // JSON value will be a decimal string. Either numbers or strings are accepted.
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
            assert(typeof value == "bigint" || typeof value == "string" || typeof value == "number");
            return value.toString();
        // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
        // Either standard or URL-safe base64 encoding with/without paddings are accepted.
        case ScalarType.BYTES:
            assert(value instanceof Uint8Array);
            return protoBase64.enc(value);
    }
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/binary-encoding.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/* eslint-disable prefer-const,no-case-declarations,@typescript-eslint/restrict-plus-operands */ /**
 * Protobuf binary format wire types.
 *
 * A wire type provides just enough information to find the length of the
 * following value.
 *
 * See https://developers.google.com/protocol-buffers/docs/encoding#structure
 */ var WireType;
(function(WireType) {
    /**
     * Used for int32, int64, uint32, uint64, sint32, sint64, bool, enum
     */ WireType[WireType["Varint"] = 0] = "Varint";
    /**
     * Used for fixed64, sfixed64, double.
     * Always 8 bytes with little-endian byte order.
     */ WireType[WireType["Bit64"] = 1] = "Bit64";
    /**
     * Used for string, bytes, embedded messages, packed repeated fields
     *
     * Only repeated numeric types (types which use the varint, 32-bit,
     * or 64-bit wire types) can be packed. In proto3, such fields are
     * packed by default.
     */ WireType[WireType["LengthDelimited"] = 2] = "LengthDelimited";
    /**
     * Start of a tag-delimited aggregate, such as a proto2 group, or a message
     * in editions with message_encoding = DELIMITED.
     */ WireType[WireType["StartGroup"] = 3] = "StartGroup";
    /**
     * End of a tag-delimited aggregate.
     */ WireType[WireType["EndGroup"] = 4] = "EndGroup";
    /**
     * Used for fixed32, sfixed32, float.
     * Always 4 bytes with little-endian byte order.
     */ WireType[WireType["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));
class BinaryWriter {
    constructor(textEncoder){
        /**
         * Previous fork states.
         */ this.stack = [];
        this.textEncoder = textEncoder !== null && textEncoder !== void 0 ? textEncoder : new TextEncoder();
        this.chunks = [];
        this.buf = [];
    }
    /**
     * Return all bytes written and reset this writer.
     */ finish() {
        this.chunks.push(new Uint8Array(this.buf)); // flush the buffer
        let len = 0;
        for(let i = 0; i < this.chunks.length; i++)len += this.chunks[i].length;
        let bytes = new Uint8Array(len);
        let offset = 0;
        for(let i = 0; i < this.chunks.length; i++){
            bytes.set(this.chunks[i], offset);
            offset += this.chunks[i].length;
        }
        this.chunks = [];
        return bytes;
    }
    /**
     * Start a new fork for length-delimited data like a message
     * or a packed repeated field.
     *
     * Must be joined later with `join()`.
     */ fork() {
        this.stack.push({
            chunks: this.chunks,
            buf: this.buf
        });
        this.chunks = [];
        this.buf = [];
        return this;
    }
    /**
     * Join the last fork. Write its length and bytes, then
     * return to the previous state.
     */ join() {
        // get chunk of fork
        let chunk = this.finish();
        // restore previous state
        let prev = this.stack.pop();
        if (!prev) throw new Error("invalid state, fork stack empty");
        this.chunks = prev.chunks;
        this.buf = prev.buf;
        // write length of chunk as varint
        this.uint32(chunk.byteLength);
        return this.raw(chunk);
    }
    /**
     * Writes a tag (field number and wire type).
     *
     * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
     *
     * Generated code should compute the tag ahead of time and call `uint32()`.
     */ tag(fieldNo, type) {
        return this.uint32((fieldNo << 3 | type) >>> 0);
    }
    /**
     * Write a chunk of raw bytes.
     */ raw(chunk) {
        if (this.buf.length) {
            this.chunks.push(new Uint8Array(this.buf));
            this.buf = [];
        }
        this.chunks.push(chunk);
        return this;
    }
    /**
     * Write a `uint32` value, an unsigned 32 bit varint.
     */ uint32(value) {
        assertUInt32(value);
        // write value as varint 32, inlined for speed
        while(value > 0x7f){
            this.buf.push(value & 0x7f | 0x80);
            value = value >>> 7;
        }
        this.buf.push(value);
        return this;
    }
    /**
     * Write a `int32` value, a signed 32 bit varint.
     */ int32(value) {
        assertInt32(value);
        varint32write(value, this.buf);
        return this;
    }
    /**
     * Write a `bool` value, a variant.
     */ bool(value) {
        this.buf.push(value ? 1 : 0);
        return this;
    }
    /**
     * Write a `bytes` value, length-delimited arbitrary data.
     */ bytes(value) {
        this.uint32(value.byteLength); // write length of chunk as varint
        return this.raw(value);
    }
    /**
     * Write a `string` value, length-delimited data converted to UTF-8 text.
     */ string(value) {
        let chunk = this.textEncoder.encode(value);
        this.uint32(chunk.byteLength); // write length of chunk as varint
        return this.raw(chunk);
    }
    /**
     * Write a `float` value, 32-bit floating point number.
     */ float(value) {
        assertFloat32(value);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setFloat32(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `double` value, a 64-bit floating point number.
     */ double(value) {
        let chunk = new Uint8Array(8);
        new DataView(chunk.buffer).setFloat64(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
     */ fixed32(value) {
        assertUInt32(value);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setUint32(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
     */ sfixed32(value) {
        assertInt32(value);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setInt32(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
     */ sint32(value) {
        assertInt32(value);
        // zigzag encode
        value = (value << 1 ^ value >> 31) >>> 0;
        varint32write(value, this.buf);
        return this;
    }
    /**
     * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
     */ sfixed64(value) {
        let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.enc(value);
        view.setInt32(0, tc.lo, true);
        view.setInt32(4, tc.hi, true);
        return this.raw(chunk);
    }
    /**
     * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
     */ fixed64(value) {
        let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.uEnc(value);
        view.setInt32(0, tc.lo, true);
        view.setInt32(4, tc.hi, true);
        return this.raw(chunk);
    }
    /**
     * Write a `int64` value, a signed 64-bit varint.
     */ int64(value) {
        let tc = protoInt64.enc(value);
        varint64write(tc.lo, tc.hi, this.buf);
        return this;
    }
    /**
     * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
     */ sint64(value) {
        let tc = protoInt64.enc(value), // zigzag encode
        sign = tc.hi >> 31, lo = tc.lo << 1 ^ sign, hi = (tc.hi << 1 | tc.lo >>> 31) ^ sign;
        varint64write(lo, hi, this.buf);
        return this;
    }
    /**
     * Write a `uint64` value, an unsigned 64-bit varint.
     */ uint64(value) {
        let tc = protoInt64.uEnc(value);
        varint64write(tc.lo, tc.hi, this.buf);
        return this;
    }
}
class BinaryReader {
    constructor(buf, textDecoder){
        this.varint64 = varint64read; // dirty cast for `this`
        /**
         * Read a `uint32` field, an unsigned 32 bit varint.
         */ this.uint32 = varint32read; // dirty cast for `this` and access to protected `buf`
        this.buf = buf;
        this.len = buf.length;
        this.pos = 0;
        this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        this.textDecoder = textDecoder !== null && textDecoder !== void 0 ? textDecoder : new TextDecoder();
    }
    /**
     * Reads a tag - field number and wire type.
     */ tag() {
        let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
        if (fieldNo <= 0 || wireType < 0 || wireType > 5) throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
        return [
            fieldNo,
            wireType
        ];
    }
    /**
     * Skip one element and return the skipped data.
     *
     * When skipping StartGroup, provide the tags field number to check for
     * matching field number in the EndGroup tag.
     */ skip(wireType, fieldNo) {
        let start = this.pos;
        switch(wireType){
            case WireType.Varint:
                while(this.buf[this.pos++] & 0x80){
                // ignore
                }
                break;
            // eslint-disable-next-line
            // @ts-ignore TS7029: Fallthrough case in switch
            case WireType.Bit64:
                this.pos += 4;
            // eslint-disable-next-line
            // @ts-ignore TS7029: Fallthrough case in switch
            case WireType.Bit32:
                this.pos += 4;
                break;
            case WireType.LengthDelimited:
                let len = this.uint32();
                this.pos += len;
                break;
            case WireType.StartGroup:
                for(;;){
                    const [fn, wt] = this.tag();
                    if (wt === WireType.EndGroup) {
                        if (fieldNo !== undefined && fn !== fieldNo) {
                            throw new Error("invalid end group tag");
                        }
                        break;
                    }
                    this.skip(wt, fn);
                }
                break;
            default:
                throw new Error("cant skip wire type " + wireType);
        }
        this.assertBounds();
        return this.buf.subarray(start, this.pos);
    }
    /**
     * Throws error if position in byte array is out of range.
     */ assertBounds() {
        if (this.pos > this.len) throw new RangeError("premature EOF");
    }
    /**
     * Read a `int32` field, a signed 32 bit varint.
     */ int32() {
        return this.uint32() | 0;
    }
    /**
     * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
     */ sint32() {
        let zze = this.uint32();
        // decode zigzag
        return zze >>> 1 ^ -(zze & 1);
    }
    /**
     * Read a `int64` field, a signed 64-bit varint.
     */ int64() {
        return protoInt64.dec(...this.varint64());
    }
    /**
     * Read a `uint64` field, an unsigned 64-bit varint.
     */ uint64() {
        return protoInt64.uDec(...this.varint64());
    }
    /**
     * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
     */ sint64() {
        let [lo, hi] = this.varint64();
        // decode zig zag
        let s = -(lo & 1);
        lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
        hi = hi >>> 1 ^ s;
        return protoInt64.dec(lo, hi);
    }
    /**
     * Read a `bool` field, a variant.
     */ bool() {
        let [lo, hi] = this.varint64();
        return lo !== 0 || hi !== 0;
    }
    /**
     * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
     */ fixed32() {
        return this.view.getUint32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
     */ sfixed32() {
        return this.view.getInt32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
     */ fixed64() {
        return protoInt64.uDec(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
     */ sfixed64() {
        return protoInt64.dec(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `float` field, 32-bit floating point number.
     */ float() {
        return this.view.getFloat32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `double` field, a 64-bit floating point number.
     */ double() {
        return this.view.getFloat64((this.pos += 8) - 8, true);
    }
    /**
     * Read a `bytes` field, length-delimited arbitrary data.
     */ bytes() {
        let len = this.uint32(), start = this.pos;
        this.pos += len;
        this.assertBounds();
        return this.buf.subarray(start, start + len);
    }
    /**
     * Read a `string` field, length-delimited data converted to UTF-8 text.
     */ string() {
        return this.textDecoder.decode(this.bytes());
    }
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/binary-format.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.








/* eslint-disable prefer-const,no-case-declarations,@typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return */ const unknownFieldsSymbol = Symbol("@bufbuild/protobuf/unknown-fields");
// Default options for parsing binary data.
const readDefaults = {
    readUnknownFields: true,
    readerFactory: (bytes)=>new BinaryReader(bytes)
};
// Default options for serializing binary data.
const writeDefaults = {
    writeUnknownFields: true,
    writerFactory: ()=>new BinaryWriter()
};
function binary_format_makeReadOptions(options) {
    return options ? Object.assign(Object.assign({}, readDefaults), options) : readDefaults;
}
function binary_format_makeWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, writeDefaults), options) : writeDefaults;
}
function makeBinaryFormat() {
    return {
        makeReadOptions: binary_format_makeReadOptions,
        makeWriteOptions: binary_format_makeWriteOptions,
        listUnknownFields (message) {
            var _a;
            return (_a = message[unknownFieldsSymbol]) !== null && _a !== void 0 ? _a : [];
        },
        discardUnknownFields (message) {
            delete message[unknownFieldsSymbol];
        },
        writeUnknownFields (message, writer) {
            const m = message;
            const c = m[unknownFieldsSymbol];
            if (c) {
                for (const f of c){
                    writer.tag(f.no, f.wireType).raw(f.data);
                }
            }
        },
        onUnknownField (message, no, wireType, data) {
            const m = message;
            if (!Array.isArray(m[unknownFieldsSymbol])) {
                m[unknownFieldsSymbol] = [];
            }
            m[unknownFieldsSymbol].push({
                no,
                wireType,
                data
            });
        },
        readMessage (message, reader, lengthOrEndTagFieldNo, options, delimitedMessageEncoding) {
            const type = message.getType();
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            const end = delimitedMessageEncoding ? reader.len : reader.pos + lengthOrEndTagFieldNo;
            let fieldNo, wireType;
            while(reader.pos < end){
                [fieldNo, wireType] = reader.tag();
                if (delimitedMessageEncoding === true && wireType == WireType.EndGroup) {
                    break;
                }
                const field = type.fields.find(fieldNo);
                if (!field) {
                    const data = reader.skip(wireType, fieldNo);
                    if (options.readUnknownFields) {
                        this.onUnknownField(message, fieldNo, wireType, data);
                    }
                    continue;
                }
                binary_format_readField(message, reader, field, wireType, options);
            }
            if (delimitedMessageEncoding && // eslint-disable-line @typescript-eslint/strict-boolean-expressions
            (wireType != WireType.EndGroup || fieldNo !== lengthOrEndTagFieldNo)) {
                throw new Error(`invalid end group tag`);
            }
        },
        readField: binary_format_readField,
        writeMessage (message, writer, options) {
            const type = message.getType();
            for (const field of type.fields.byNumber()){
                if (!isFieldSet(field, message)) {
                    if (field.req) {
                        throw new Error(`cannot encode field ${type.typeName}.${field.name} to binary: required field not set`);
                    }
                    continue;
                }
                const value = field.oneof ? message[field.oneof.localName].value : message[field.localName];
                binary_format_writeField(field, value, writer, options);
            }
            if (options.writeUnknownFields) {
                this.writeUnknownFields(message, writer);
            }
            return writer;
        },
        writeField (field, value, writer, options) {
            // The behavior of our internal function has changed, it does no longer
            // accept `undefined` values for singular scalar and map.
            // For backwards-compatibility, we support the old form that is part of
            // the public API through the interface BinaryFormat.
            if (value === undefined) {
                return undefined;
            }
            binary_format_writeField(field, value, writer, options);
        }
    };
}
function binary_format_readField(target, reader, field, wireType, options) {
    let { repeated, localName } = field;
    if (field.oneof) {
        target = target[field.oneof.localName];
        if (target.case != localName) {
            delete target.value;
        }
        target.case = localName;
        localName = "value";
    }
    switch(field.kind){
        case "scalar":
        case "enum":
            const scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
            let read = binary_format_readScalar;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- acceptable since it's covered by tests
            if (field.kind == "scalar" && field.L > 0) {
                read = readScalarLTString;
            }
            if (repeated) {
                let arr = target[localName]; // safe to assume presence of array, oneof cannot contain repeated values
                const isPacked = wireType == WireType.LengthDelimited && scalarType != ScalarType.STRING && scalarType != ScalarType.BYTES;
                if (isPacked) {
                    let e = reader.uint32() + reader.pos;
                    while(reader.pos < e){
                        arr.push(read(reader, scalarType));
                    }
                } else {
                    arr.push(read(reader, scalarType));
                }
            } else {
                target[localName] = read(reader, scalarType);
            }
            break;
        case "message":
            const messageType = field.T;
            if (repeated) {
                // safe to assume presence of array, oneof cannot contain repeated values
                target[localName].push(readMessageField(reader, new messageType(), options, field));
            } else {
                if (isMessage(target[localName])) {
                    readMessageField(reader, target[localName], options, field);
                } else {
                    target[localName] = readMessageField(reader, new messageType(), options, field);
                    if (messageType.fieldWrapper && !field.oneof && !field.repeated) {
                        target[localName] = messageType.fieldWrapper.unwrapField(target[localName]);
                    }
                }
            }
            break;
        case "map":
            let [mapKey, mapVal] = readMapEntry(field, reader, options);
            // safe to assume presence of map object, oneof cannot contain repeated values
            target[localName][mapKey] = mapVal;
            break;
    }
}
// Read a message, avoiding MessageType.fromBinary() to re-use the
// BinaryReadOptions and the IBinaryReader.
function readMessageField(reader, message, options, field) {
    const format = message.getType().runtime.bin;
    const delimited = field === null || field === void 0 ? void 0 : field.delimited;
    format.readMessage(message, reader, delimited ? field.no : reader.uint32(), options, delimited);
    return message;
}
// Read a map field, expecting key field = 1, value field = 2
function readMapEntry(field, reader, options) {
    const length = reader.uint32(), end = reader.pos + length;
    let key, val;
    while(reader.pos < end){
        const [fieldNo] = reader.tag();
        switch(fieldNo){
            case 1:
                key = binary_format_readScalar(reader, field.K);
                break;
            case 2:
                switch(field.V.kind){
                    case "scalar":
                        val = binary_format_readScalar(reader, field.V.T);
                        break;
                    case "enum":
                        val = reader.int32();
                        break;
                    case "message":
                        val = readMessageField(reader, new field.V.T(), options, undefined);
                        break;
                }
                break;
        }
    }
    if (key === undefined) {
        key = scalarZeroValue(field.K, LongType.BIGINT);
    }
    if (typeof key != "string" && typeof key != "number") {
        key = key.toString();
    }
    if (val === undefined) {
        switch(field.V.kind){
            case "scalar":
                val = scalarZeroValue(field.V.T, LongType.BIGINT);
                break;
            case "enum":
                val = field.V.T.values[0].no;
                break;
            case "message":
                val = new field.V.T();
                break;
        }
    }
    return [
        key,
        val
    ];
}
// Read a scalar value, but return 64 bit integral types (int64, uint64,
// sint64, fixed64, sfixed64) as string instead of bigint.
function readScalarLTString(reader, type) {
    const v = binary_format_readScalar(reader, type);
    return typeof v == "bigint" ? v.toString() : v;
}
// Does not use scalarTypeInfo() for better performance.
function binary_format_readScalar(reader, type) {
    switch(type){
        case ScalarType.STRING:
            return reader.string();
        case ScalarType.BOOL:
            return reader.bool();
        case ScalarType.DOUBLE:
            return reader.double();
        case ScalarType.FLOAT:
            return reader.float();
        case ScalarType.INT32:
            return reader.int32();
        case ScalarType.INT64:
            return reader.int64();
        case ScalarType.UINT64:
            return reader.uint64();
        case ScalarType.FIXED64:
            return reader.fixed64();
        case ScalarType.BYTES:
            return reader.bytes();
        case ScalarType.FIXED32:
            return reader.fixed32();
        case ScalarType.SFIXED32:
            return reader.sfixed32();
        case ScalarType.SFIXED64:
            return reader.sfixed64();
        case ScalarType.SINT64:
            return reader.sint64();
        case ScalarType.UINT32:
            return reader.uint32();
        case ScalarType.SINT32:
            return reader.sint32();
    }
}
function binary_format_writeField(field, value, writer, options) {
    assert(value !== undefined);
    const repeated = field.repeated;
    switch(field.kind){
        case "scalar":
        case "enum":
            let scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
            if (repeated) {
                assert(Array.isArray(value));
                if (field.packed) {
                    writePacked(writer, scalarType, field.no, value);
                } else {
                    for (const item of value){
                        binary_format_writeScalar(writer, scalarType, field.no, item);
                    }
                }
            } else {
                binary_format_writeScalar(writer, scalarType, field.no, value);
            }
            break;
        case "message":
            if (repeated) {
                assert(Array.isArray(value));
                for (const item of value){
                    writeMessageField(writer, options, field, item);
                }
            } else {
                writeMessageField(writer, options, field, value);
            }
            break;
        case "map":
            assert(typeof value == "object" && value != null);
            for (const [key, val] of Object.entries(value)){
                writeMapEntry(writer, options, field, key, val);
            }
            break;
    }
}
function writeMapEntry(writer, options, field, key, value) {
    writer.tag(field.no, WireType.LengthDelimited);
    writer.fork();
    // javascript only allows number or string for object properties
    // we convert from our representation to the protobuf type
    let keyValue = key;
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- we deliberately handle just the special cases for map keys
    switch(field.K){
        case ScalarType.INT32:
        case ScalarType.FIXED32:
        case ScalarType.UINT32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
            keyValue = Number.parseInt(key);
            break;
        case ScalarType.BOOL:
            assert(key == "true" || key == "false");
            keyValue = key == "true";
            break;
    }
    // write key, expecting key field number = 1
    binary_format_writeScalar(writer, field.K, 1, keyValue);
    // write value, expecting value field number = 2
    switch(field.V.kind){
        case "scalar":
            binary_format_writeScalar(writer, field.V.T, 2, value);
            break;
        case "enum":
            binary_format_writeScalar(writer, ScalarType.INT32, 2, value);
            break;
        case "message":
            assert(value !== undefined);
            writer.tag(2, WireType.LengthDelimited).bytes(value.toBinary(options));
            break;
    }
    writer.join();
}
// Value must not be undefined
function writeMessageField(writer, options, field, value) {
    const message = wrapField(field.T, value);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (field.delimited) writer.tag(field.no, WireType.StartGroup).raw(message.toBinary(options)).tag(field.no, WireType.EndGroup);
    else writer.tag(field.no, WireType.LengthDelimited).bytes(message.toBinary(options));
}
function binary_format_writeScalar(writer, type, fieldNo, value) {
    assert(value !== undefined);
    let [wireType, method] = scalarTypeInfo(type);
    writer.tag(fieldNo, wireType)[method](value);
}
function writePacked(writer, type, fieldNo, value) {
    if (!value.length) {
        return;
    }
    writer.tag(fieldNo, WireType.LengthDelimited).fork();
    let [, method] = scalarTypeInfo(type);
    for(let i = 0; i < value.length; i++){
        writer[method](value[i]);
    }
    writer.join();
}
/**
 * Get information for writing a scalar value.
 *
 * Returns tuple:
 * [0]: appropriate WireType
 * [1]: name of the appropriate method of IBinaryWriter
 * [2]: whether the given value is a default value for proto3 semantics
 *
 * If argument `value` is omitted, [2] is always false.
 */ // TODO replace call-sites writeScalar() and writePacked(), then remove
function scalarTypeInfo(type) {
    let wireType = WireType.Varint;
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- INT32, UINT32, SINT32 are covered by the defaults
    switch(type){
        case ScalarType.BYTES:
        case ScalarType.STRING:
            wireType = WireType.LengthDelimited;
            break;
        case ScalarType.DOUBLE:
        case ScalarType.FIXED64:
        case ScalarType.SFIXED64:
            wireType = WireType.Bit64;
            break;
        case ScalarType.FIXED32:
        case ScalarType.SFIXED32:
        case ScalarType.FLOAT:
            wireType = WireType.Bit32;
            break;
    }
    const method = ScalarType[type].toLowerCase();
    return [
        wireType,
        method
    ];
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/util-common.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.





/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-argument,no-case-declarations */ function makeUtilCommon() {
    return {
        setEnumType: setEnumType,
        initPartial (source, target) {
            if (source === undefined) {
                return;
            }
            const type = target.getType();
            for (const member of type.fields.byMember()){
                const localName = member.localName, t = target, s = source;
                if (s[localName] == null) {
                    continue;
                }
                switch(member.kind){
                    case "oneof":
                        const sk = s[localName].case;
                        if (sk === undefined) {
                            continue;
                        }
                        const sourceField = member.findField(sk);
                        let val = s[localName].value;
                        if (sourceField && sourceField.kind == "message" && !isMessage(val, sourceField.T)) {
                            val = new sourceField.T(val);
                        } else if (sourceField && sourceField.kind === "scalar" && sourceField.T === ScalarType.BYTES) {
                            val = toU8Arr(val);
                        }
                        t[localName] = {
                            case: sk,
                            value: val
                        };
                        break;
                    case "scalar":
                    case "enum":
                        let copy = s[localName];
                        if (member.T === ScalarType.BYTES) {
                            copy = member.repeated ? copy.map(toU8Arr) : toU8Arr(copy);
                        }
                        t[localName] = copy;
                        break;
                    case "map":
                        switch(member.V.kind){
                            case "scalar":
                            case "enum":
                                if (member.V.T === ScalarType.BYTES) {
                                    for (const [k, v] of Object.entries(s[localName])){
                                        t[localName][k] = toU8Arr(v);
                                    }
                                } else {
                                    Object.assign(t[localName], s[localName]);
                                }
                                break;
                            case "message":
                                const messageType = member.V.T;
                                for (const k of Object.keys(s[localName])){
                                    let val = s[localName][k];
                                    if (!messageType.fieldWrapper) {
                                        // We only take partial input for messages that are not a wrapper type.
                                        // For those messages, we recursively normalize the partial input.
                                        val = new messageType(val);
                                    }
                                    t[localName][k] = val;
                                }
                                break;
                        }
                        break;
                    case "message":
                        const mt = member.T;
                        if (member.repeated) {
                            t[localName] = s[localName].map((val)=>isMessage(val, mt) ? val : new mt(val));
                        } else {
                            const val = s[localName];
                            if (mt.fieldWrapper) {
                                if (// We can't use BytesValue.typeName as that will create a circular import
                                mt.typeName === "google.protobuf.BytesValue") {
                                    t[localName] = toU8Arr(val);
                                } else {
                                    t[localName] = val;
                                }
                            } else {
                                t[localName] = isMessage(val, mt) ? val : new mt(val);
                            }
                        }
                        break;
                }
            }
        },
        // TODO use isFieldSet() here to support future field presence
        equals (type, a, b) {
            if (a === b) {
                return true;
            }
            if (!a || !b) {
                return false;
            }
            return type.fields.byMember().every((m)=>{
                const va = a[m.localName];
                const vb = b[m.localName];
                if (m.repeated) {
                    if (va.length !== vb.length) {
                        return false;
                    }
                    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- repeated fields are never "map"
                    switch(m.kind){
                        case "message":
                            return va.every((a, i)=>m.T.equals(a, vb[i]));
                        case "scalar":
                            return va.every((a, i)=>scalarEquals(m.T, a, vb[i]));
                        case "enum":
                            return va.every((a, i)=>scalarEquals(ScalarType.INT32, a, vb[i]));
                    }
                    throw new Error(`repeated cannot contain ${m.kind}`);
                }
                switch(m.kind){
                    case "message":
                        return m.T.equals(va, vb);
                    case "enum":
                        return scalarEquals(ScalarType.INT32, va, vb);
                    case "scalar":
                        return scalarEquals(m.T, va, vb);
                    case "oneof":
                        if (va.case !== vb.case) {
                            return false;
                        }
                        const s = m.findField(va.case);
                        if (s === undefined) {
                            return true;
                        }
                        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- oneof fields are never "map"
                        switch(s.kind){
                            case "message":
                                return s.T.equals(va.value, vb.value);
                            case "enum":
                                return scalarEquals(ScalarType.INT32, va.value, vb.value);
                            case "scalar":
                                return scalarEquals(s.T, va.value, vb.value);
                        }
                        throw new Error(`oneof cannot contain ${s.kind}`);
                    case "map":
                        const keys = Object.keys(va).concat(Object.keys(vb));
                        switch(m.V.kind){
                            case "message":
                                const messageType = m.V.T;
                                return keys.every((k)=>messageType.equals(va[k], vb[k]));
                            case "enum":
                                return keys.every((k)=>scalarEquals(ScalarType.INT32, va[k], vb[k]));
                            case "scalar":
                                const scalarType = m.V.T;
                                return keys.every((k)=>scalarEquals(scalarType, va[k], vb[k]));
                        }
                        break;
                }
            });
        },
        // TODO use isFieldSet() here to support future field presence
        clone (message) {
            const type = message.getType(), target = new type(), any = target;
            for (const member of type.fields.byMember()){
                const source = message[member.localName];
                let copy;
                if (member.repeated) {
                    copy = source.map(cloneSingularField);
                } else if (member.kind == "map") {
                    copy = any[member.localName];
                    for (const [key, v] of Object.entries(source)){
                        copy[key] = cloneSingularField(v);
                    }
                } else if (member.kind == "oneof") {
                    const f = member.findField(source.case);
                    copy = f ? {
                        case: source.case,
                        value: cloneSingularField(source.value)
                    } : {
                        case: undefined
                    };
                } else {
                    copy = cloneSingularField(source);
                }
                any[member.localName] = copy;
            }
            for (const uf of type.runtime.bin.listUnknownFields(message)){
                type.runtime.bin.onUnknownField(any, uf.no, uf.wireType, uf.data);
            }
            return target;
        }
    };
}
// clone a single field value - i.e. the element type of repeated fields, the value type of maps
function cloneSingularField(value) {
    if (value === undefined) {
        return value;
    }
    if (isMessage(value)) {
        return value.clone();
    }
    if (value instanceof Uint8Array) {
        const c = new Uint8Array(value.byteLength);
        c.set(value);
        return c;
    }
    return value;
}
// converts any ArrayLike<number> to Uint8Array if necessary.
function toU8Arr(input) {
    return input instanceof Uint8Array ? input : new Uint8Array(input);
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/proto-runtime.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.






function makeProtoRuntime(syntax, newFieldList, initFields) {
    return {
        syntax,
        json: makeJsonFormat(),
        bin: makeBinaryFormat(),
        util: Object.assign(Object.assign({}, makeUtilCommon()), {
            newFieldList,
            initFields
        }),
        makeMessageType (typeName, fields, opt) {
            return makeMessageType(this, typeName, fields, opt);
        },
        makeEnum: makeEnum,
        makeEnumType: makeEnumType,
        getEnumType: getEnumType,
        makeExtension (typeName, extendee, field) {
            return makeExtension(this, typeName, extendee, field);
        }
    };
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/field-list.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
class InternalFieldList {
    constructor(fields, normalizer){
        this._fields = fields;
        this._normalizer = normalizer;
    }
    findJsonName(jsonName) {
        if (!this.jsonNames) {
            const t = {};
            for (const f of this.list()){
                t[f.jsonName] = t[f.name] = f;
            }
            this.jsonNames = t;
        }
        return this.jsonNames[jsonName];
    }
    find(fieldNo) {
        if (!this.numbers) {
            const t = {};
            for (const f of this.list()){
                t[f.no] = f;
            }
            this.numbers = t;
        }
        return this.numbers[fieldNo];
    }
    list() {
        if (!this.all) {
            this.all = this._normalizer(this._fields);
        }
        return this.all;
    }
    byNumber() {
        if (!this.numbersAsc) {
            this.numbersAsc = this.list().concat().sort((a, b)=>a.no - b.no);
        }
        return this.numbersAsc;
    }
    byMember() {
        if (!this.members) {
            this.members = [];
            const a = this.members;
            let o;
            for (const f of this.list()){
                if (f.oneof) {
                    if (f.oneof !== o) {
                        o = f.oneof;
                        a.push(o);
                    }
                } else {
                    a.push(f);
                }
            }
        }
        return this.members;
    }
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/names.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Returns the name of a protobuf element in generated code.
 *
 * Field names - including oneofs - are converted to lowerCamelCase. For
 * messages, enumerations and services, the package name is stripped from
 * the type name. For nested messages and enumerations, the names are joined
 * with an underscore. For methods, the first character is made lowercase.
 */ function localName(desc) {
    switch(desc.kind){
        case "field":
            return localFieldName(desc.name, desc.oneof !== undefined);
        case "oneof":
            return localOneofName(desc.name);
        case "enum":
        case "message":
        case "service":
        case "extension":
            {
                const pkg = desc.file.proto.package;
                const offset = pkg === undefined ? 0 : pkg.length + 1;
                const name = desc.typeName.substring(offset).replace(/\./g, "_");
                // For services, we only care about safe identifiers, not safe object properties,
                // but we have shipped v1 with a bug that respected object properties, and we
                // do not want to introduce a breaking change, so we continue to escape for
                // safe object properties.
                // See https://github.com/bufbuild/protobuf-es/pull/391
                return safeObjectProperty(safeIdentifier(name));
            }
        case "enum_value":
            {
                let name = desc.name;
                const sharedPrefix = desc.parent.sharedPrefix;
                if (sharedPrefix !== undefined) {
                    name = name.substring(sharedPrefix.length);
                }
                return safeObjectProperty(name);
            }
        case "rpc":
            {
                let name = desc.name;
                if (name.length == 0) {
                    return name;
                }
                name = name[0].toLowerCase() + name.substring(1);
                return safeObjectProperty(name);
            }
    }
}
/**
 * Returns the name of a field in generated code.
 */ function localFieldName(protoName, inOneof) {
    const name = protoCamelCase(protoName);
    if (inOneof) {
        // oneof member names are not properties, but values of the `case` property.
        return name;
    }
    return safeObjectProperty(safeMessageProperty(name));
}
/**
 * Returns the name of a oneof group in generated code.
 */ function localOneofName(protoName) {
    return localFieldName(protoName, false);
}
/**
 * Returns the JSON name for a protobuf field, exactly like protoc does.
 */ const fieldJsonName = protoCamelCase;
/**
 * Finds a prefix shared by enum values, for example `MY_ENUM_` for
 * `enum MyEnum {MY_ENUM_A=0; MY_ENUM_B=1;}`.
 */ function findEnumSharedPrefix(enumName, valueNames) {
    const prefix = camelToSnakeCase(enumName) + "_";
    for (const name of valueNames){
        if (!name.toLowerCase().startsWith(prefix)) {
            return undefined;
        }
        const shortName = name.substring(prefix.length);
        if (shortName.length == 0) {
            return undefined;
        }
        if (/^\d/.test(shortName)) {
            // identifiers must not start with numbers
            return undefined;
        }
    }
    return prefix;
}
/**
 * Converts lowerCamelCase or UpperCamelCase into lower_snake_case.
 * This is used to find shared prefixes in an enum.
 */ function camelToSnakeCase(camel) {
    return (camel.substring(0, 1) + camel.substring(1).replace(/[A-Z]/g, (c)=>"_" + c)).toLowerCase();
}
/**
 * Converts snake_case to protoCamelCase according to the convention
 * used by protoc to convert a field name to a JSON name.
 */ function protoCamelCase(snakeCase) {
    let capNext = false;
    const b = [];
    for(let i = 0; i < snakeCase.length; i++){
        let c = snakeCase.charAt(i);
        switch(c){
            case "_":
                capNext = true;
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                b.push(c);
                capNext = false;
                break;
            default:
                if (capNext) {
                    capNext = false;
                    c = c.toUpperCase();
                }
                b.push(c);
                break;
        }
    }
    return b.join("");
}
/**
 * Names that cannot be used for identifiers, such as class names,
 * but _can_ be used for object properties.
 */ const reservedIdentifiers = new Set([
    // ECMAScript 2015 keywords
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
    // ECMAScript 2015 future reserved keywords
    "enum",
    "implements",
    "interface",
    "let",
    "package",
    "private",
    "protected",
    "public",
    "static",
    // Class name cannot be 'Object' when targeting ES5 with module CommonJS
    "Object",
    // TypeScript keywords that cannot be used for types (as opposed to variables)
    "bigint",
    "number",
    "boolean",
    "string",
    "object",
    // Identifiers reserved for the runtime, so we can generate legible code
    "globalThis",
    "Uint8Array",
    "Partial"
]);
/**
 * Names that cannot be used for object properties because they are reserved
 * by built-in JavaScript properties.
 */ const reservedObjectProperties = new Set([
    // names reserved by JavaScript
    "constructor",
    "toString",
    "toJSON",
    "valueOf"
]);
/**
 * Names that cannot be used for object properties because they are reserved
 * by the runtime.
 */ const reservedMessageProperties = new Set([
    // names reserved by the runtime
    "getType",
    "clone",
    "equals",
    "fromBinary",
    "fromJson",
    "fromJsonString",
    "toBinary",
    "toJson",
    "toJsonString",
    // names reserved by the runtime for the future
    "toObject"
]);
const fallback = (name)=>`${name}$`;
/**
 * Will wrap names that are Object prototype properties or names reserved
 * for `Message`s.
 */ const safeMessageProperty = (name)=>{
    if (reservedMessageProperties.has(name)) {
        return fallback(name);
    }
    return name;
};
/**
 * Names that cannot be used for object properties because they are reserved
 * by built-in JavaScript properties.
 */ const safeObjectProperty = (name)=>{
    if (reservedObjectProperties.has(name)) {
        return fallback(name);
    }
    return name;
};
/**
 * Names that can be used for identifiers or class properties
 */ const safeIdentifier = (name)=>{
    if (reservedIdentifiers.has(name)) {
        return fallback(name);
    }
    return name;
};

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/field.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


class InternalOneofInfo {
    constructor(name){
        this.kind = "oneof";
        this.repeated = false;
        this.packed = false;
        this.opt = false;
        this.req = false;
        this.default = undefined;
        this.fields = [];
        this.name = name;
        this.localName = localOneofName(name);
    }
    addField(field) {
        assert(field.oneof === this, `field ${field.name} not one of ${this.name}`);
        this.fields.push(field);
    }
    findField(localName) {
        if (!this._lookup) {
            this._lookup = Object.create(null);
            for(let i = 0; i < this.fields.length; i++){
                this._lookup[this.fields[i].localName] = this.fields[i];
            }
        }
        return this._lookup[localName];
    }
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/private/field-normalize.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/**
 * Convert a collection of field info to an array of normalized FieldInfo.
 *
 * The argument `packedByDefault` specifies whether fields that do not specify
 * `packed` should be packed (proto3) or unpacked (proto2).
 */ function normalizeFieldInfos(fieldInfos, packedByDefault) {
    var _a, _b, _c, _d, _e, _f;
    const r = [];
    let o;
    for (const field of typeof fieldInfos == "function" ? fieldInfos() : fieldInfos){
        const f = field;
        f.localName = localFieldName(field.name, field.oneof !== undefined);
        f.jsonName = (_a = field.jsonName) !== null && _a !== void 0 ? _a : fieldJsonName(field.name);
        f.repeated = (_b = field.repeated) !== null && _b !== void 0 ? _b : false;
        if (field.kind == "scalar") {
            f.L = (_c = field.L) !== null && _c !== void 0 ? _c : LongType.BIGINT;
        }
        f.delimited = (_d = field.delimited) !== null && _d !== void 0 ? _d : false;
        f.req = (_e = field.req) !== null && _e !== void 0 ? _e : false;
        f.opt = (_f = field.opt) !== null && _f !== void 0 ? _f : false;
        if (field.packed === undefined) {
            if (packedByDefault) {
                f.packed = field.kind == "enum" || field.kind == "scalar" && field.T != ScalarType.BYTES && field.T != ScalarType.STRING;
            } else {
                f.packed = false;
            }
        }
        // We do not surface options at this time
        // f.options = field.options ?? emptyReadonlyObject;
        if (field.oneof !== undefined) {
            const ooname = typeof field.oneof == "string" ? field.oneof : field.oneof.name;
            if (!o || o.name != ooname) {
                o = new InternalOneofInfo(ooname);
            }
            f.oneof = o;
            o.addField(f);
        }
        r.push(f);
    }
    return r;
}

;// CONCATENATED MODULE: ./node_modules/@bufbuild/protobuf/dist/esm/proto3.js
// Copyright 2021-2024 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.




/**
 * Provides functionality for messages defined with the proto3 syntax.
 */ const proto3_proto3 = makeProtoRuntime("proto3", (fields)=>{
    return new InternalFieldList(fields, (source)=>normalizeFieldInfos(source, true));
}, // TODO merge with proto2 and initExtensionField, also see initPartial, equals, clone
(target)=>{
    for (const member of target.getType().fields.byMember()){
        if (member.opt) {
            continue;
        }
        const name = member.localName, t = target;
        if (member.repeated) {
            t[name] = [];
            continue;
        }
        switch(member.kind){
            case "oneof":
                t[name] = {
                    case: undefined
                };
                break;
            case "enum":
                t[name] = 0;
                break;
            case "map":
                t[name] = {};
                break;
            case "scalar":
                t[name] = scalarZeroValue(member.T, member.L);
                break;
            case "message":
                break;
        }
    }
});

;// CONCATENATED MODULE: ./node_modules/@livekit/protocol/dist/index.mjs


const MetricLabel = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.MetricLabel", [
    {
        no: 0,
        name: "AGENTS_LLM_TTFT"
    },
    {
        no: 1,
        name: "AGENTS_STT_TTFT"
    },
    {
        no: 2,
        name: "AGENTS_TTS_TTFB"
    },
    {
        no: 3,
        name: "CLIENT_VIDEO_SUBSCRIBER_FREEZE_COUNT"
    },
    {
        no: 4,
        name: "CLIENT_VIDEO_SUBSCRIBER_TOTAL_FREEZE_DURATION"
    },
    {
        no: 5,
        name: "CLIENT_VIDEO_SUBSCRIBER_PAUSE_COUNT"
    },
    {
        no: 6,
        name: "CLIENT_VIDEO_SUBSCRIBER_TOTAL_PAUSES_DURATION"
    },
    {
        no: 7,
        name: "CLIENT_AUDIO_SUBSCRIBER_CONCEALED_SAMPLES"
    },
    {
        no: 8,
        name: "CLIENT_AUDIO_SUBSCRIBER_SILENT_CONCEALED_SAMPLES"
    },
    {
        no: 9,
        name: "CLIENT_AUDIO_SUBSCRIBER_CONCEALMENT_EVENTS"
    },
    {
        no: 10,
        name: "CLIENT_AUDIO_SUBSCRIBER_INTERRUPTION_COUNT"
    },
    {
        no: 11,
        name: "CLIENT_AUDIO_SUBSCRIBER_TOTAL_INTERRUPTION_DURATION"
    },
    {
        no: 12,
        name: "CLIENT_SUBSCRIBER_JITTER_BUFFER_DELAY"
    },
    {
        no: 13,
        name: "CLIENT_SUBSCRIBER_JITTER_BUFFER_EMITTED_COUNT"
    },
    {
        no: 14,
        name: "CLIENT_VIDEO_PUBLISHER_QUALITY_LIMITATION_DURATION_BANDWIDTH"
    },
    {
        no: 15,
        name: "CLIENT_VIDEO_PUBLISHER_QUALITY_LIMITATION_DURATION_CPU"
    },
    {
        no: 16,
        name: "CLIENT_VIDEO_PUBLISHER_QUALITY_LIMITATION_DURATION_OTHER"
    },
    {
        no: 17,
        name: "PUBLISHER_RTT"
    },
    {
        no: 18,
        name: "SERVER_MESH_RTT"
    },
    {
        no: 19,
        name: "SUBSCRIBER_RTT"
    },
    {
        no: 4096,
        name: "METRIC_LABEL_PREDEFINED_MAX_VALUE"
    }
]);
const MetricsBatch = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.MetricsBatch", ()=>[
        {
            no: 1,
            name: "timestamp_ms",
            kind: "scalar",
            T: 3
        },
        {
            no: 2,
            name: "normalized_timestamp",
            kind: "message",
            T: Timestamp
        },
        {
            no: 3,
            name: "str_data",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 4,
            name: "time_series",
            kind: "message",
            T: TimeSeriesMetric,
            repeated: true
        },
        {
            no: 5,
            name: "events",
            kind: "message",
            T: EventMetric,
            repeated: true
        }
    ])));
const TimeSeriesMetric = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.TimeSeriesMetric", ()=>[
        {
            no: 1,
            name: "label",
            kind: "scalar",
            T: 13
        },
        {
            no: 2,
            name: "participant_identity",
            kind: "scalar",
            T: 13
        },
        {
            no: 3,
            name: "track_sid",
            kind: "scalar",
            T: 13
        },
        {
            no: 4,
            name: "samples",
            kind: "message",
            T: MetricSample,
            repeated: true
        },
        {
            no: 5,
            name: "rid",
            kind: "scalar",
            T: 13
        }
    ])));
const MetricSample = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.MetricSample", ()=>[
        {
            no: 1,
            name: "timestamp_ms",
            kind: "scalar",
            T: 3
        },
        {
            no: 2,
            name: "normalized_timestamp",
            kind: "message",
            T: Timestamp
        },
        {
            no: 3,
            name: "value",
            kind: "scalar",
            T: 2
        }
    ])));
const EventMetric = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.EventMetric", ()=>[
        {
            no: 1,
            name: "label",
            kind: "scalar",
            T: 13
        },
        {
            no: 2,
            name: "participant_identity",
            kind: "scalar",
            T: 13
        },
        {
            no: 3,
            name: "track_sid",
            kind: "scalar",
            T: 13
        },
        {
            no: 4,
            name: "start_timestamp_ms",
            kind: "scalar",
            T: 3
        },
        {
            no: 5,
            name: "end_timestamp_ms",
            kind: "scalar",
            T: 3,
            opt: true
        },
        {
            no: 6,
            name: "normalized_start_timestamp",
            kind: "message",
            T: Timestamp
        },
        {
            no: 7,
            name: "normalized_end_timestamp",
            kind: "message",
            T: Timestamp,
            opt: true
        },
        {
            no: 8,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "rid",
            kind: "scalar",
            T: 13
        }
    ])));
const AudioCodec = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.AudioCodec", [
    {
        no: 0,
        name: "DEFAULT_AC"
    },
    {
        no: 1,
        name: "OPUS"
    },
    {
        no: 2,
        name: "AAC"
    }
]);
const VideoCodec = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.VideoCodec", [
    {
        no: 0,
        name: "DEFAULT_VC"
    },
    {
        no: 1,
        name: "H264_BASELINE"
    },
    {
        no: 2,
        name: "H264_MAIN"
    },
    {
        no: 3,
        name: "H264_HIGH"
    },
    {
        no: 4,
        name: "VP8"
    }
]);
const ImageCodec = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.ImageCodec", [
    {
        no: 0,
        name: "IC_DEFAULT"
    },
    {
        no: 1,
        name: "IC_JPEG"
    }
]);
const BackupCodecPolicy = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.BackupCodecPolicy", [
    {
        no: 0,
        name: "REGRESSION"
    },
    {
        no: 1,
        name: "SIMULCAST"
    }
]);
const TrackType = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.TrackType", [
    {
        no: 0,
        name: "AUDIO"
    },
    {
        no: 1,
        name: "VIDEO"
    },
    {
        no: 2,
        name: "DATA"
    }
]);
const TrackSource = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.TrackSource", [
    {
        no: 0,
        name: "UNKNOWN"
    },
    {
        no: 1,
        name: "CAMERA"
    },
    {
        no: 2,
        name: "MICROPHONE"
    },
    {
        no: 3,
        name: "SCREEN_SHARE"
    },
    {
        no: 4,
        name: "SCREEN_SHARE_AUDIO"
    }
]);
const VideoQuality = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.VideoQuality", [
    {
        no: 0,
        name: "LOW"
    },
    {
        no: 1,
        name: "MEDIUM"
    },
    {
        no: 2,
        name: "HIGH"
    },
    {
        no: 3,
        name: "OFF"
    }
]);
const ConnectionQuality = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.ConnectionQuality", [
    {
        no: 0,
        name: "POOR"
    },
    {
        no: 1,
        name: "GOOD"
    },
    {
        no: 2,
        name: "EXCELLENT"
    },
    {
        no: 3,
        name: "LOST"
    }
]);
const ClientConfigSetting = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.ClientConfigSetting", [
    {
        no: 0,
        name: "UNSET"
    },
    {
        no: 1,
        name: "DISABLED"
    },
    {
        no: 2,
        name: "ENABLED"
    }
]);
const DisconnectReason = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.DisconnectReason", [
    {
        no: 0,
        name: "UNKNOWN_REASON"
    },
    {
        no: 1,
        name: "CLIENT_INITIATED"
    },
    {
        no: 2,
        name: "DUPLICATE_IDENTITY"
    },
    {
        no: 3,
        name: "SERVER_SHUTDOWN"
    },
    {
        no: 4,
        name: "PARTICIPANT_REMOVED"
    },
    {
        no: 5,
        name: "ROOM_DELETED"
    },
    {
        no: 6,
        name: "STATE_MISMATCH"
    },
    {
        no: 7,
        name: "JOIN_FAILURE"
    },
    {
        no: 8,
        name: "MIGRATION"
    },
    {
        no: 9,
        name: "SIGNAL_CLOSE"
    },
    {
        no: 10,
        name: "ROOM_CLOSED"
    },
    {
        no: 11,
        name: "USER_UNAVAILABLE"
    },
    {
        no: 12,
        name: "USER_REJECTED"
    },
    {
        no: 13,
        name: "SIP_TRUNK_FAILURE"
    }
]);
const ReconnectReason = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.ReconnectReason", [
    {
        no: 0,
        name: "RR_UNKNOWN"
    },
    {
        no: 1,
        name: "RR_SIGNAL_DISCONNECTED"
    },
    {
        no: 2,
        name: "RR_PUBLISHER_FAILED"
    },
    {
        no: 3,
        name: "RR_SUBSCRIBER_FAILED"
    },
    {
        no: 4,
        name: "RR_SWITCH_CANDIDATE"
    }
]);
const SubscriptionError = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SubscriptionError", [
    {
        no: 0,
        name: "SE_UNKNOWN"
    },
    {
        no: 1,
        name: "SE_CODEC_UNSUPPORTED"
    },
    {
        no: 2,
        name: "SE_TRACK_NOTFOUND"
    }
]);
const AudioTrackFeature = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.AudioTrackFeature", [
    {
        no: 0,
        name: "TF_STEREO"
    },
    {
        no: 1,
        name: "TF_NO_DTX"
    },
    {
        no: 2,
        name: "TF_AUTO_GAIN_CONTROL"
    },
    {
        no: 3,
        name: "TF_ECHO_CANCELLATION"
    },
    {
        no: 4,
        name: "TF_NOISE_SUPPRESSION"
    },
    {
        no: 5,
        name: "TF_ENHANCED_NOISE_CANCELLATION"
    }
]);
const Pagination = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.Pagination", ()=>[
        {
            no: 1,
            name: "after_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "limit",
            kind: "scalar",
            T: 5
        }
    ])));
const Room = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.Room", ()=>[
        {
            no: 1,
            name: "sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "empty_timeout",
            kind: "scalar",
            T: 13
        },
        {
            no: 14,
            name: "departure_timeout",
            kind: "scalar",
            T: 13
        },
        {
            no: 4,
            name: "max_participants",
            kind: "scalar",
            T: 13
        },
        {
            no: 5,
            name: "creation_time",
            kind: "scalar",
            T: 3
        },
        {
            no: 15,
            name: "creation_time_ms",
            kind: "scalar",
            T: 3
        },
        {
            no: 6,
            name: "turn_password",
            kind: "scalar",
            T: 9
        },
        {
            no: 7,
            name: "enabled_codecs",
            kind: "message",
            T: Codec,
            repeated: true
        },
        {
            no: 8,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "num_participants",
            kind: "scalar",
            T: 13
        },
        {
            no: 11,
            name: "num_publishers",
            kind: "scalar",
            T: 13
        },
        {
            no: 10,
            name: "active_recording",
            kind: "scalar",
            T: 8
        },
        {
            no: 13,
            name: "version",
            kind: "message",
            T: TimedVersion
        }
    ]);
const Codec = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.Codec", ()=>[
        {
            no: 1,
            name: "mime",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "fmtp_line",
            kind: "scalar",
            T: 9
        }
    ]);
const PlayoutDelay = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.PlayoutDelay", ()=>[
        {
            no: 1,
            name: "enabled",
            kind: "scalar",
            T: 8
        },
        {
            no: 2,
            name: "min",
            kind: "scalar",
            T: 13
        },
        {
            no: 3,
            name: "max",
            kind: "scalar",
            T: 13
        }
    ])));
const ParticipantPermission = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.ParticipantPermission", ()=>[
        {
            no: 1,
            name: "can_subscribe",
            kind: "scalar",
            T: 8
        },
        {
            no: 2,
            name: "can_publish",
            kind: "scalar",
            T: 8
        },
        {
            no: 3,
            name: "can_publish_data",
            kind: "scalar",
            T: 8
        },
        {
            no: 9,
            name: "can_publish_sources",
            kind: "enum",
            T: proto3_proto3.getEnumType(TrackSource),
            repeated: true
        },
        {
            no: 7,
            name: "hidden",
            kind: "scalar",
            T: 8
        },
        {
            no: 8,
            name: "recorder",
            kind: "scalar",
            T: 8
        },
        {
            no: 10,
            name: "can_update_metadata",
            kind: "scalar",
            T: 8
        },
        {
            no: 11,
            name: "agent",
            kind: "scalar",
            T: 8
        },
        {
            no: 12,
            name: "can_subscribe_metrics",
            kind: "scalar",
            T: 8
        }
    ]);
const ParticipantInfo = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.ParticipantInfo", ()=>[
        {
            no: 1,
            name: "sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "state",
            kind: "enum",
            T: proto3_proto3.getEnumType(ParticipantInfo_State)
        },
        {
            no: 4,
            name: "tracks",
            kind: "message",
            T: TrackInfo,
            repeated: true
        },
        {
            no: 5,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "joined_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 17,
            name: "joined_at_ms",
            kind: "scalar",
            T: 3
        },
        {
            no: 9,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 10,
            name: "version",
            kind: "scalar",
            T: 13
        },
        {
            no: 11,
            name: "permission",
            kind: "message",
            T: ParticipantPermission
        },
        {
            no: 12,
            name: "region",
            kind: "scalar",
            T: 9
        },
        {
            no: 13,
            name: "is_publisher",
            kind: "scalar",
            T: 8
        },
        {
            no: 14,
            name: "kind",
            kind: "enum",
            T: proto3_proto3.getEnumType(ParticipantInfo_Kind)
        },
        {
            no: 15,
            name: "attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 16,
            name: "disconnect_reason",
            kind: "enum",
            T: proto3_proto3.getEnumType(DisconnectReason)
        }
    ]);
const ParticipantInfo_State = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.ParticipantInfo.State", [
    {
        no: 0,
        name: "JOINING"
    },
    {
        no: 1,
        name: "JOINED"
    },
    {
        no: 2,
        name: "ACTIVE"
    },
    {
        no: 3,
        name: "DISCONNECTED"
    }
]);
const ParticipantInfo_Kind = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.ParticipantInfo.Kind", [
    {
        no: 0,
        name: "STANDARD"
    },
    {
        no: 1,
        name: "INGRESS"
    },
    {
        no: 2,
        name: "EGRESS"
    },
    {
        no: 3,
        name: "SIP"
    },
    {
        no: 4,
        name: "AGENT"
    }
]);
const Encryption = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.Encryption", [])));
const Encryption_Type = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.Encryption.Type", [
    {
        no: 0,
        name: "NONE"
    },
    {
        no: 1,
        name: "GCM"
    },
    {
        no: 2,
        name: "CUSTOM"
    }
]);
const SimulcastCodecInfo = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.SimulcastCodecInfo", ()=>[
        {
            no: 1,
            name: "mime_type",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "mid",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "cid",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "layers",
            kind: "message",
            T: VideoLayer,
            repeated: true
        }
    ]);
const TrackInfo = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.TrackInfo", ()=>[
        {
            no: 1,
            name: "sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "type",
            kind: "enum",
            T: proto3_proto3.getEnumType(TrackType)
        },
        {
            no: 3,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "muted",
            kind: "scalar",
            T: 8
        },
        {
            no: 5,
            name: "width",
            kind: "scalar",
            T: 13
        },
        {
            no: 6,
            name: "height",
            kind: "scalar",
            T: 13
        },
        {
            no: 7,
            name: "simulcast",
            kind: "scalar",
            T: 8
        },
        {
            no: 8,
            name: "disable_dtx",
            kind: "scalar",
            T: 8
        },
        {
            no: 9,
            name: "source",
            kind: "enum",
            T: proto3_proto3.getEnumType(TrackSource)
        },
        {
            no: 10,
            name: "layers",
            kind: "message",
            T: VideoLayer,
            repeated: true
        },
        {
            no: 11,
            name: "mime_type",
            kind: "scalar",
            T: 9
        },
        {
            no: 12,
            name: "mid",
            kind: "scalar",
            T: 9
        },
        {
            no: 13,
            name: "codecs",
            kind: "message",
            T: SimulcastCodecInfo,
            repeated: true
        },
        {
            no: 14,
            name: "stereo",
            kind: "scalar",
            T: 8
        },
        {
            no: 15,
            name: "disable_red",
            kind: "scalar",
            T: 8
        },
        {
            no: 16,
            name: "encryption",
            kind: "enum",
            T: proto3_proto3.getEnumType(Encryption_Type)
        },
        {
            no: 17,
            name: "stream",
            kind: "scalar",
            T: 9
        },
        {
            no: 18,
            name: "version",
            kind: "message",
            T: TimedVersion
        },
        {
            no: 19,
            name: "audio_features",
            kind: "enum",
            T: proto3_proto3.getEnumType(AudioTrackFeature),
            repeated: true
        },
        {
            no: 20,
            name: "backup_codec_policy",
            kind: "enum",
            T: proto3_proto3.getEnumType(BackupCodecPolicy)
        }
    ]);
const VideoLayer = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.VideoLayer", ()=>[
        {
            no: 1,
            name: "quality",
            kind: "enum",
            T: proto3_proto3.getEnumType(VideoQuality)
        },
        {
            no: 2,
            name: "width",
            kind: "scalar",
            T: 13
        },
        {
            no: 3,
            name: "height",
            kind: "scalar",
            T: 13
        },
        {
            no: 4,
            name: "bitrate",
            kind: "scalar",
            T: 13
        },
        {
            no: 5,
            name: "ssrc",
            kind: "scalar",
            T: 13
        }
    ]);
const DataPacket = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.DataPacket", ()=>[
        {
            no: 1,
            name: "kind",
            kind: "enum",
            T: proto3.getEnumType(DataPacket_Kind)
        },
        {
            no: 4,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "destination_identities",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 2,
            name: "user",
            kind: "message",
            T: UserPacket,
            oneof: "value"
        },
        {
            no: 3,
            name: "speaker",
            kind: "message",
            T: ActiveSpeakerUpdate,
            oneof: "value"
        },
        {
            no: 6,
            name: "sip_dtmf",
            kind: "message",
            T: SipDTMF,
            oneof: "value"
        },
        {
            no: 7,
            name: "transcription",
            kind: "message",
            T: Transcription,
            oneof: "value"
        },
        {
            no: 8,
            name: "metrics",
            kind: "message",
            T: MetricsBatch,
            oneof: "value"
        },
        {
            no: 9,
            name: "chat_message",
            kind: "message",
            T: ChatMessage,
            oneof: "value"
        },
        {
            no: 10,
            name: "rpc_request",
            kind: "message",
            T: RpcRequest,
            oneof: "value"
        },
        {
            no: 11,
            name: "rpc_ack",
            kind: "message",
            T: RpcAck,
            oneof: "value"
        },
        {
            no: 12,
            name: "rpc_response",
            kind: "message",
            T: RpcResponse,
            oneof: "value"
        },
        {
            no: 13,
            name: "stream_header",
            kind: "message",
            T: DataStream_Header,
            oneof: "value"
        },
        {
            no: 14,
            name: "stream_chunk",
            kind: "message",
            T: DataStream_Chunk,
            oneof: "value"
        },
        {
            no: 15,
            name: "stream_trailer",
            kind: "message",
            T: DataStream_Trailer,
            oneof: "value"
        }
    ])));
const DataPacket_Kind = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.DataPacket.Kind", [
    {
        no: 0,
        name: "RELIABLE"
    },
    {
        no: 1,
        name: "LOSSY"
    }
]);
const ActiveSpeakerUpdate = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ActiveSpeakerUpdate", ()=>[
        {
            no: 1,
            name: "speakers",
            kind: "message",
            T: SpeakerInfo,
            repeated: true
        }
    ])));
const SpeakerInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SpeakerInfo", ()=>[
        {
            no: 1,
            name: "sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "level",
            kind: "scalar",
            T: 2
        },
        {
            no: 3,
            name: "active",
            kind: "scalar",
            T: 8
        }
    ])));
const UserPacket = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UserPacket", ()=>[
        {
            no: 1,
            name: "participant_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "payload",
            kind: "scalar",
            T: 12
        },
        {
            no: 3,
            name: "destination_sids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 6,
            name: "destination_identities",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 4,
            name: "topic",
            kind: "scalar",
            T: 9,
            opt: true
        },
        {
            no: 8,
            name: "id",
            kind: "scalar",
            T: 9,
            opt: true
        },
        {
            no: 9,
            name: "start_time",
            kind: "scalar",
            T: 4,
            opt: true
        },
        {
            no: 10,
            name: "end_time",
            kind: "scalar",
            T: 4,
            opt: true
        },
        {
            no: 11,
            name: "nonce",
            kind: "scalar",
            T: 12
        }
    ])));
const SipDTMF = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SipDTMF", ()=>[
        {
            no: 3,
            name: "code",
            kind: "scalar",
            T: 13
        },
        {
            no: 4,
            name: "digit",
            kind: "scalar",
            T: 9
        }
    ])));
const Transcription = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.Transcription", ()=>[
        {
            no: 2,
            name: "transcribed_participant_identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "track_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "segments",
            kind: "message",
            T: TranscriptionSegment,
            repeated: true
        }
    ])));
const TranscriptionSegment = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.TranscriptionSegment", ()=>[
        {
            no: 1,
            name: "id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "text",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "start_time",
            kind: "scalar",
            T: 4
        },
        {
            no: 4,
            name: "end_time",
            kind: "scalar",
            T: 4
        },
        {
            no: 5,
            name: "final",
            kind: "scalar",
            T: 8
        },
        {
            no: 6,
            name: "language",
            kind: "scalar",
            T: 9
        }
    ])));
const ChatMessage = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ChatMessage", ()=>[
        {
            no: 1,
            name: "id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "timestamp",
            kind: "scalar",
            T: 3
        },
        {
            no: 3,
            name: "edit_timestamp",
            kind: "scalar",
            T: 3,
            opt: true
        },
        {
            no: 4,
            name: "message",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "deleted",
            kind: "scalar",
            T: 8
        },
        {
            no: 6,
            name: "generated",
            kind: "scalar",
            T: 8
        }
    ])));
const RpcRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RpcRequest", ()=>[
        {
            no: 1,
            name: "id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "method",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "payload",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "response_timeout_ms",
            kind: "scalar",
            T: 13
        },
        {
            no: 5,
            name: "version",
            kind: "scalar",
            T: 13
        }
    ])));
const RpcAck = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RpcAck", ()=>[
        {
            no: 1,
            name: "request_id",
            kind: "scalar",
            T: 9
        }
    ])));
const RpcResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RpcResponse", ()=>[
        {
            no: 1,
            name: "request_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "payload",
            kind: "scalar",
            T: 9,
            oneof: "value"
        },
        {
            no: 3,
            name: "error",
            kind: "message",
            T: RpcError,
            oneof: "value"
        }
    ])));
const RpcError = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RpcError", ()=>[
        {
            no: 1,
            name: "code",
            kind: "scalar",
            T: 13
        },
        {
            no: 2,
            name: "message",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "data",
            kind: "scalar",
            T: 9
        }
    ])));
const ParticipantTracks = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.ParticipantTracks", ()=>[
        {
            no: 1,
            name: "participant_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "track_sids",
            kind: "scalar",
            T: 9,
            repeated: true
        }
    ]);
const ServerInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ServerInfo", ()=>[
        {
            no: 1,
            name: "edition",
            kind: "enum",
            T: proto3.getEnumType(ServerInfo_Edition)
        },
        {
            no: 2,
            name: "version",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "protocol",
            kind: "scalar",
            T: 5
        },
        {
            no: 4,
            name: "region",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "node_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "debug_info",
            kind: "scalar",
            T: 9
        },
        {
            no: 7,
            name: "agent_protocol",
            kind: "scalar",
            T: 5
        }
    ])));
const ServerInfo_Edition = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.ServerInfo.Edition", [
    {
        no: 0,
        name: "Standard"
    },
    {
        no: 1,
        name: "Cloud"
    }
]);
const ClientInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ClientInfo", ()=>[
        {
            no: 1,
            name: "sdk",
            kind: "enum",
            T: proto3.getEnumType(ClientInfo_SDK)
        },
        {
            no: 2,
            name: "version",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "protocol",
            kind: "scalar",
            T: 5
        },
        {
            no: 4,
            name: "os",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "os_version",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "device_model",
            kind: "scalar",
            T: 9
        },
        {
            no: 7,
            name: "browser",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "browser_version",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "address",
            kind: "scalar",
            T: 9
        },
        {
            no: 10,
            name: "network",
            kind: "scalar",
            T: 9
        },
        {
            no: 11,
            name: "other_sdks",
            kind: "scalar",
            T: 9
        }
    ])));
const ClientInfo_SDK = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.ClientInfo.SDK", [
    {
        no: 0,
        name: "UNKNOWN"
    },
    {
        no: 1,
        name: "JS"
    },
    {
        no: 2,
        name: "SWIFT"
    },
    {
        no: 3,
        name: "ANDROID"
    },
    {
        no: 4,
        name: "FLUTTER"
    },
    {
        no: 5,
        name: "GO"
    },
    {
        no: 6,
        name: "UNITY"
    },
    {
        no: 7,
        name: "REACT_NATIVE"
    },
    {
        no: 8,
        name: "RUST"
    },
    {
        no: 9,
        name: "PYTHON"
    },
    {
        no: 10,
        name: "CPP"
    },
    {
        no: 11,
        name: "UNITY_WEB"
    },
    {
        no: 12,
        name: "NODE"
    }
]);
const ClientConfiguration = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ClientConfiguration", ()=>[
        {
            no: 1,
            name: "video",
            kind: "message",
            T: VideoConfiguration
        },
        {
            no: 2,
            name: "screen",
            kind: "message",
            T: VideoConfiguration
        },
        {
            no: 3,
            name: "resume_connection",
            kind: "enum",
            T: proto3.getEnumType(ClientConfigSetting)
        },
        {
            no: 4,
            name: "disabled_codecs",
            kind: "message",
            T: DisabledCodecs
        },
        {
            no: 5,
            name: "force_relay",
            kind: "enum",
            T: proto3.getEnumType(ClientConfigSetting)
        }
    ])));
const VideoConfiguration = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.VideoConfiguration", ()=>[
        {
            no: 1,
            name: "hardware_encoder",
            kind: "enum",
            T: proto3.getEnumType(ClientConfigSetting)
        }
    ])));
const DisabledCodecs = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.DisabledCodecs", ()=>[
        {
            no: 1,
            name: "codecs",
            kind: "message",
            T: Codec,
            repeated: true
        },
        {
            no: 2,
            name: "publish",
            kind: "message",
            T: Codec,
            repeated: true
        }
    ])));
const RTPDrift = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RTPDrift", ()=>[
        {
            no: 1,
            name: "start_time",
            kind: "message",
            T: Timestamp
        },
        {
            no: 2,
            name: "end_time",
            kind: "message",
            T: Timestamp
        },
        {
            no: 3,
            name: "duration",
            kind: "scalar",
            T: 1
        },
        {
            no: 4,
            name: "start_timestamp",
            kind: "scalar",
            T: 4
        },
        {
            no: 5,
            name: "end_timestamp",
            kind: "scalar",
            T: 4
        },
        {
            no: 6,
            name: "rtp_clock_ticks",
            kind: "scalar",
            T: 4
        },
        {
            no: 7,
            name: "drift_samples",
            kind: "scalar",
            T: 3
        },
        {
            no: 8,
            name: "drift_ms",
            kind: "scalar",
            T: 1
        },
        {
            no: 9,
            name: "clock_rate",
            kind: "scalar",
            T: 1
        }
    ])));
const RTPStats = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RTPStats", ()=>[
        {
            no: 1,
            name: "start_time",
            kind: "message",
            T: Timestamp
        },
        {
            no: 2,
            name: "end_time",
            kind: "message",
            T: Timestamp
        },
        {
            no: 3,
            name: "duration",
            kind: "scalar",
            T: 1
        },
        {
            no: 4,
            name: "packets",
            kind: "scalar",
            T: 13
        },
        {
            no: 5,
            name: "packet_rate",
            kind: "scalar",
            T: 1
        },
        {
            no: 6,
            name: "bytes",
            kind: "scalar",
            T: 4
        },
        {
            no: 39,
            name: "header_bytes",
            kind: "scalar",
            T: 4
        },
        {
            no: 7,
            name: "bitrate",
            kind: "scalar",
            T: 1
        },
        {
            no: 8,
            name: "packets_lost",
            kind: "scalar",
            T: 13
        },
        {
            no: 9,
            name: "packet_loss_rate",
            kind: "scalar",
            T: 1
        },
        {
            no: 10,
            name: "packet_loss_percentage",
            kind: "scalar",
            T: 2
        },
        {
            no: 11,
            name: "packets_duplicate",
            kind: "scalar",
            T: 13
        },
        {
            no: 12,
            name: "packet_duplicate_rate",
            kind: "scalar",
            T: 1
        },
        {
            no: 13,
            name: "bytes_duplicate",
            kind: "scalar",
            T: 4
        },
        {
            no: 40,
            name: "header_bytes_duplicate",
            kind: "scalar",
            T: 4
        },
        {
            no: 14,
            name: "bitrate_duplicate",
            kind: "scalar",
            T: 1
        },
        {
            no: 15,
            name: "packets_padding",
            kind: "scalar",
            T: 13
        },
        {
            no: 16,
            name: "packet_padding_rate",
            kind: "scalar",
            T: 1
        },
        {
            no: 17,
            name: "bytes_padding",
            kind: "scalar",
            T: 4
        },
        {
            no: 41,
            name: "header_bytes_padding",
            kind: "scalar",
            T: 4
        },
        {
            no: 18,
            name: "bitrate_padding",
            kind: "scalar",
            T: 1
        },
        {
            no: 19,
            name: "packets_out_of_order",
            kind: "scalar",
            T: 13
        },
        {
            no: 20,
            name: "frames",
            kind: "scalar",
            T: 13
        },
        {
            no: 21,
            name: "frame_rate",
            kind: "scalar",
            T: 1
        },
        {
            no: 22,
            name: "jitter_current",
            kind: "scalar",
            T: 1
        },
        {
            no: 23,
            name: "jitter_max",
            kind: "scalar",
            T: 1
        },
        {
            no: 24,
            name: "gap_histogram",
            kind: "map",
            K: 5,
            V: {
                kind: "scalar",
                T: 13
            }
        },
        {
            no: 25,
            name: "nacks",
            kind: "scalar",
            T: 13
        },
        {
            no: 37,
            name: "nack_acks",
            kind: "scalar",
            T: 13
        },
        {
            no: 26,
            name: "nack_misses",
            kind: "scalar",
            T: 13
        },
        {
            no: 38,
            name: "nack_repeated",
            kind: "scalar",
            T: 13
        },
        {
            no: 27,
            name: "plis",
            kind: "scalar",
            T: 13
        },
        {
            no: 28,
            name: "last_pli",
            kind: "message",
            T: Timestamp
        },
        {
            no: 29,
            name: "firs",
            kind: "scalar",
            T: 13
        },
        {
            no: 30,
            name: "last_fir",
            kind: "message",
            T: Timestamp
        },
        {
            no: 31,
            name: "rtt_current",
            kind: "scalar",
            T: 13
        },
        {
            no: 32,
            name: "rtt_max",
            kind: "scalar",
            T: 13
        },
        {
            no: 33,
            name: "key_frames",
            kind: "scalar",
            T: 13
        },
        {
            no: 34,
            name: "last_key_frame",
            kind: "message",
            T: Timestamp
        },
        {
            no: 35,
            name: "layer_lock_plis",
            kind: "scalar",
            T: 13
        },
        {
            no: 36,
            name: "last_layer_lock_pli",
            kind: "message",
            T: Timestamp
        },
        {
            no: 44,
            name: "packet_drift",
            kind: "message",
            T: RTPDrift
        },
        {
            no: 45,
            name: "ntp_report_drift",
            kind: "message",
            T: RTPDrift
        },
        {
            no: 46,
            name: "rebased_report_drift",
            kind: "message",
            T: RTPDrift
        },
        {
            no: 47,
            name: "received_report_drift",
            kind: "message",
            T: RTPDrift
        }
    ])));
const RTCPSenderReportState = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RTCPSenderReportState", ()=>[
        {
            no: 1,
            name: "rtp_timestamp",
            kind: "scalar",
            T: 13
        },
        {
            no: 2,
            name: "rtp_timestamp_ext",
            kind: "scalar",
            T: 4
        },
        {
            no: 3,
            name: "ntp_timestamp",
            kind: "scalar",
            T: 4
        },
        {
            no: 4,
            name: "at",
            kind: "scalar",
            T: 3
        },
        {
            no: 5,
            name: "at_adjusted",
            kind: "scalar",
            T: 3
        },
        {
            no: 6,
            name: "packets",
            kind: "scalar",
            T: 13
        },
        {
            no: 7,
            name: "octets",
            kind: "scalar",
            T: 4
        }
    ])));
const RTPForwarderState = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RTPForwarderState", ()=>[
        {
            no: 1,
            name: "started",
            kind: "scalar",
            T: 8
        },
        {
            no: 2,
            name: "reference_layer_spatial",
            kind: "scalar",
            T: 5
        },
        {
            no: 3,
            name: "pre_start_time",
            kind: "scalar",
            T: 3
        },
        {
            no: 4,
            name: "ext_first_timestamp",
            kind: "scalar",
            T: 4
        },
        {
            no: 5,
            name: "dummy_start_timestamp_offset",
            kind: "scalar",
            T: 4
        },
        {
            no: 6,
            name: "rtp_munger",
            kind: "message",
            T: RTPMungerState
        },
        {
            no: 7,
            name: "vp8_munger",
            kind: "message",
            T: VP8MungerState,
            oneof: "codec_munger"
        },
        {
            no: 8,
            name: "sender_report_state",
            kind: "message",
            T: RTCPSenderReportState,
            repeated: true
        }
    ])));
const RTPMungerState = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RTPMungerState", ()=>[
        {
            no: 1,
            name: "ext_last_sequence_number",
            kind: "scalar",
            T: 4
        },
        {
            no: 2,
            name: "ext_second_last_sequence_number",
            kind: "scalar",
            T: 4
        },
        {
            no: 3,
            name: "ext_last_timestamp",
            kind: "scalar",
            T: 4
        },
        {
            no: 4,
            name: "ext_second_last_timestamp",
            kind: "scalar",
            T: 4
        },
        {
            no: 5,
            name: "last_marker",
            kind: "scalar",
            T: 8
        },
        {
            no: 6,
            name: "second_last_marker",
            kind: "scalar",
            T: 8
        }
    ])));
const VP8MungerState = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.VP8MungerState", ()=>[
        {
            no: 1,
            name: "ext_last_picture_id",
            kind: "scalar",
            T: 5
        },
        {
            no: 2,
            name: "picture_id_used",
            kind: "scalar",
            T: 8
        },
        {
            no: 3,
            name: "last_tl0_pic_idx",
            kind: "scalar",
            T: 13
        },
        {
            no: 4,
            name: "tl0_pic_idx_used",
            kind: "scalar",
            T: 8
        },
        {
            no: 5,
            name: "tid_used",
            kind: "scalar",
            T: 8
        },
        {
            no: 6,
            name: "last_key_idx",
            kind: "scalar",
            T: 13
        },
        {
            no: 7,
            name: "key_idx_used",
            kind: "scalar",
            T: 8
        }
    ])));
const TimedVersion = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.TimedVersion", ()=>[
        {
            no: 1,
            name: "unix_micro",
            kind: "scalar",
            T: 3
        },
        {
            no: 2,
            name: "ticks",
            kind: "scalar",
            T: 5
        }
    ]);
const DataStream = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.DataStream", [])));
const DataStream_OperationType = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.DataStream.OperationType", [
    {
        no: 0,
        name: "CREATE"
    },
    {
        no: 1,
        name: "UPDATE"
    },
    {
        no: 2,
        name: "DELETE"
    },
    {
        no: 3,
        name: "REACTION"
    }
]);
const DataStream_TextHeader = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.DataStream.TextHeader", ()=>[
        {
            no: 1,
            name: "operation_type",
            kind: "enum",
            T: proto3_proto3.getEnumType(DataStream_OperationType)
        },
        {
            no: 2,
            name: "version",
            kind: "scalar",
            T: 5
        },
        {
            no: 3,
            name: "reply_to_stream_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "attached_stream_ids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 5,
            name: "generated",
            kind: "scalar",
            T: 8
        }
    ], {
    localName: "DataStream_TextHeader"
});
const DataStream_ByteHeader = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.DataStream.ByteHeader", ()=>[
        {
            no: 1,
            name: "name",
            kind: "scalar",
            T: 9
        }
    ], {
    localName: "DataStream_ByteHeader"
});
const DataStream_Header = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.DataStream.Header", ()=>[
        {
            no: 1,
            name: "stream_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "timestamp",
            kind: "scalar",
            T: 3
        },
        {
            no: 3,
            name: "topic",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "mime_type",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "total_length",
            kind: "scalar",
            T: 4,
            opt: true
        },
        {
            no: 7,
            name: "encryption_type",
            kind: "enum",
            T: proto3_proto3.getEnumType(Encryption_Type)
        },
        {
            no: 8,
            name: "attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 9,
            name: "text_header",
            kind: "message",
            T: DataStream_TextHeader,
            oneof: "content_header"
        },
        {
            no: 10,
            name: "byte_header",
            kind: "message",
            T: DataStream_ByteHeader,
            oneof: "content_header"
        }
    ], {
    localName: "DataStream_Header"
});
const DataStream_Chunk = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.DataStream.Chunk", ()=>[
        {
            no: 1,
            name: "stream_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "chunk_index",
            kind: "scalar",
            T: 4
        },
        {
            no: 3,
            name: "content",
            kind: "scalar",
            T: 12
        },
        {
            no: 4,
            name: "version",
            kind: "scalar",
            T: 5
        },
        {
            no: 5,
            name: "iv",
            kind: "scalar",
            T: 12,
            opt: true
        }
    ], {
    localName: "DataStream_Chunk"
});
const DataStream_Trailer = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.DataStream.Trailer", ()=>[
        {
            no: 1,
            name: "stream_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "reason",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        }
    ], {
    localName: "DataStream_Trailer"
});
const JobType = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.JobType", [
    {
        no: 0,
        name: "JT_ROOM"
    },
    {
        no: 1,
        name: "JT_PUBLISHER"
    },
    {
        no: 2,
        name: "JT_PARTICIPANT"
    }
]);
const WorkerStatus = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.WorkerStatus", [
    {
        no: 0,
        name: "WS_AVAILABLE"
    },
    {
        no: 1,
        name: "WS_FULL"
    }
]);
const JobStatus = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.JobStatus", [
    {
        no: 0,
        name: "JS_PENDING"
    },
    {
        no: 1,
        name: "JS_RUNNING"
    },
    {
        no: 2,
        name: "JS_SUCCESS"
    },
    {
        no: 3,
        name: "JS_FAILED"
    }
]);
const Job = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.Job", ()=>[
        {
            no: 1,
            name: "id",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "dispatch_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "type",
            kind: "enum",
            T: proto3.getEnumType(JobType)
        },
        {
            no: 3,
            name: "room",
            kind: "message",
            T: Room
        },
        {
            no: 4,
            name: "participant",
            kind: "message",
            T: ParticipantInfo,
            opt: true
        },
        {
            no: 5,
            name: "namespace",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 7,
            name: "agent_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "state",
            kind: "message",
            T: JobState
        }
    ])));
const JobState = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.JobState", ()=>[
        {
            no: 1,
            name: "status",
            kind: "enum",
            T: proto3.getEnumType(JobStatus)
        },
        {
            no: 2,
            name: "error",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "started_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 4,
            name: "ended_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 5,
            name: "updated_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 6,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        }
    ])));
const WorkerMessage = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.WorkerMessage", ()=>[
        {
            no: 1,
            name: "register",
            kind: "message",
            T: RegisterWorkerRequest,
            oneof: "message"
        },
        {
            no: 2,
            name: "availability",
            kind: "message",
            T: AvailabilityResponse,
            oneof: "message"
        },
        {
            no: 3,
            name: "update_worker",
            kind: "message",
            T: UpdateWorkerStatus,
            oneof: "message"
        },
        {
            no: 4,
            name: "update_job",
            kind: "message",
            T: UpdateJobStatus,
            oneof: "message"
        },
        {
            no: 5,
            name: "ping",
            kind: "message",
            T: WorkerPing,
            oneof: "message"
        },
        {
            no: 6,
            name: "simulate_job",
            kind: "message",
            T: SimulateJobRequest,
            oneof: "message"
        },
        {
            no: 7,
            name: "migrate_job",
            kind: "message",
            T: MigrateJobRequest,
            oneof: "message"
        }
    ])));
const ServerMessage = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ServerMessage", ()=>[
        {
            no: 1,
            name: "register",
            kind: "message",
            T: RegisterWorkerResponse,
            oneof: "message"
        },
        {
            no: 2,
            name: "availability",
            kind: "message",
            T: AvailabilityRequest,
            oneof: "message"
        },
        {
            no: 3,
            name: "assignment",
            kind: "message",
            T: JobAssignment,
            oneof: "message"
        },
        {
            no: 5,
            name: "termination",
            kind: "message",
            T: JobTermination,
            oneof: "message"
        },
        {
            no: 4,
            name: "pong",
            kind: "message",
            T: WorkerPong,
            oneof: "message"
        }
    ])));
const SimulateJobRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SimulateJobRequest", ()=>[
        {
            no: 1,
            name: "type",
            kind: "enum",
            T: proto3.getEnumType(JobType)
        },
        {
            no: 2,
            name: "room",
            kind: "message",
            T: Room
        },
        {
            no: 3,
            name: "participant",
            kind: "message",
            T: ParticipantInfo
        }
    ])));
const WorkerPing = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.WorkerPing", ()=>[
        {
            no: 1,
            name: "timestamp",
            kind: "scalar",
            T: 3
        }
    ])));
const WorkerPong = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.WorkerPong", ()=>[
        {
            no: 1,
            name: "last_timestamp",
            kind: "scalar",
            T: 3
        },
        {
            no: 2,
            name: "timestamp",
            kind: "scalar",
            T: 3
        }
    ])));
const RegisterWorkerRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RegisterWorkerRequest", ()=>[
        {
            no: 1,
            name: "type",
            kind: "enum",
            T: proto3.getEnumType(JobType)
        },
        {
            no: 8,
            name: "agent_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "version",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "ping_interval",
            kind: "scalar",
            T: 13
        },
        {
            no: 6,
            name: "namespace",
            kind: "scalar",
            T: 9,
            opt: true
        },
        {
            no: 7,
            name: "allowed_permissions",
            kind: "message",
            T: ParticipantPermission
        }
    ])));
const RegisterWorkerResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RegisterWorkerResponse", ()=>[
        {
            no: 1,
            name: "worker_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "server_info",
            kind: "message",
            T: ServerInfo
        }
    ])));
const MigrateJobRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.MigrateJobRequest", ()=>[
        {
            no: 2,
            name: "job_ids",
            kind: "scalar",
            T: 9,
            repeated: true
        }
    ])));
const AvailabilityRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.AvailabilityRequest", ()=>[
        {
            no: 1,
            name: "job",
            kind: "message",
            T: Job
        },
        {
            no: 2,
            name: "resuming",
            kind: "scalar",
            T: 8
        }
    ])));
const AvailabilityResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.AvailabilityResponse", ()=>[
        {
            no: 1,
            name: "job_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "available",
            kind: "scalar",
            T: 8
        },
        {
            no: 3,
            name: "supports_resume",
            kind: "scalar",
            T: 8
        },
        {
            no: 4,
            name: "participant_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "participant_metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 7,
            name: "participant_attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        }
    ])));
const UpdateJobStatus = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateJobStatus", ()=>[
        {
            no: 1,
            name: "job_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "status",
            kind: "enum",
            T: proto3.getEnumType(JobStatus)
        },
        {
            no: 3,
            name: "error",
            kind: "scalar",
            T: 9
        }
    ])));
const UpdateWorkerStatus = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateWorkerStatus", ()=>[
        {
            no: 1,
            name: "status",
            kind: "enum",
            T: proto3.getEnumType(WorkerStatus),
            opt: true
        },
        {
            no: 3,
            name: "load",
            kind: "scalar",
            T: 2
        },
        {
            no: 4,
            name: "job_count",
            kind: "scalar",
            T: 13
        }
    ])));
const JobAssignment = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.JobAssignment", ()=>[
        {
            no: 1,
            name: "job",
            kind: "message",
            T: Job
        },
        {
            no: 2,
            name: "url",
            kind: "scalar",
            T: 9,
            opt: true
        },
        {
            no: 3,
            name: "token",
            kind: "scalar",
            T: 9
        }
    ])));
const JobTermination = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.JobTermination", ()=>[
        {
            no: 1,
            name: "job_id",
            kind: "scalar",
            T: 9
        }
    ])));
const dist_CreateAgentDispatchRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.CreateAgentDispatchRequest", ()=>[
        {
            no: 1,
            name: "agent_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "room",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "metadata",
            kind: "scalar",
            T: 9
        }
    ])));
const RoomAgentDispatch = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.RoomAgentDispatch", ()=>[
        {
            no: 1,
            name: "agent_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "metadata",
            kind: "scalar",
            T: 9
        }
    ]);
const dist_DeleteAgentDispatchRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.DeleteAgentDispatchRequest", ()=>[
        {
            no: 1,
            name: "dispatch_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "room",
            kind: "scalar",
            T: 9
        }
    ])));
const dist_ListAgentDispatchRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListAgentDispatchRequest", ()=>[
        {
            no: 1,
            name: "dispatch_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "room",
            kind: "scalar",
            T: 9
        }
    ])));
const dist_ListAgentDispatchResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListAgentDispatchResponse", ()=>[
        {
            no: 1,
            name: "agent_dispatches",
            kind: "message",
            T: dist_AgentDispatch,
            repeated: true
        }
    ])));
const dist_AgentDispatch = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.AgentDispatch", ()=>[
        {
            no: 1,
            name: "id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "agent_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "room",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "state",
            kind: "message",
            T: AgentDispatchState
        }
    ])));
const AgentDispatchState = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.AgentDispatchState", ()=>[
        {
            no: 1,
            name: "jobs",
            kind: "message",
            T: Job,
            repeated: true
        },
        {
            no: 2,
            name: "created_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 3,
            name: "deleted_at",
            kind: "scalar",
            T: 3
        }
    ])));
const EncodedFileType = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.EncodedFileType", [
    {
        no: 0,
        name: "DEFAULT_FILETYPE"
    },
    {
        no: 1,
        name: "MP4"
    },
    {
        no: 2,
        name: "OGG"
    }
]);
const SegmentedFileProtocol = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SegmentedFileProtocol", [
    {
        no: 0,
        name: "DEFAULT_SEGMENTED_FILE_PROTOCOL"
    },
    {
        no: 1,
        name: "HLS_PROTOCOL"
    }
]);
const SegmentedFileSuffix = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SegmentedFileSuffix", [
    {
        no: 0,
        name: "INDEX"
    },
    {
        no: 1,
        name: "TIMESTAMP"
    }
]);
const ImageFileSuffix = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.ImageFileSuffix", [
    {
        no: 0,
        name: "IMAGE_SUFFIX_INDEX"
    },
    {
        no: 1,
        name: "IMAGE_SUFFIX_TIMESTAMP"
    }
]);
const StreamProtocol = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.StreamProtocol", [
    {
        no: 0,
        name: "DEFAULT_PROTOCOL"
    },
    {
        no: 1,
        name: "RTMP"
    },
    {
        no: 2,
        name: "SRT"
    }
]);
const AudioMixing = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.AudioMixing", [
    {
        no: 0,
        name: "DEFAULT_MIXING"
    },
    {
        no: 1,
        name: "DUAL_CHANNEL_AGENT"
    },
    {
        no: 2,
        name: "DUAL_CHANNEL_ALTERNATE"
    }
]);
const EncodingOptionsPreset = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.EncodingOptionsPreset", [
    {
        no: 0,
        name: "H264_720P_30"
    },
    {
        no: 1,
        name: "H264_720P_60"
    },
    {
        no: 2,
        name: "H264_1080P_30"
    },
    {
        no: 3,
        name: "H264_1080P_60"
    },
    {
        no: 4,
        name: "PORTRAIT_H264_720P_30"
    },
    {
        no: 5,
        name: "PORTRAIT_H264_720P_60"
    },
    {
        no: 6,
        name: "PORTRAIT_H264_1080P_30"
    },
    {
        no: 7,
        name: "PORTRAIT_H264_1080P_60"
    }
]);
const EgressStatus = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.EgressStatus", [
    {
        no: 0,
        name: "EGRESS_STARTING"
    },
    {
        no: 1,
        name: "EGRESS_ACTIVE"
    },
    {
        no: 2,
        name: "EGRESS_ENDING"
    },
    {
        no: 3,
        name: "EGRESS_COMPLETE"
    },
    {
        no: 4,
        name: "EGRESS_FAILED"
    },
    {
        no: 5,
        name: "EGRESS_ABORTED"
    },
    {
        no: 6,
        name: "EGRESS_LIMIT_REACHED"
    }
]);
const EgressSourceType = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.EgressSourceType", [
    {
        no: 0,
        name: "EGRESS_SOURCE_TYPE_WEB",
        localName: "WEB"
    },
    {
        no: 1,
        name: "EGRESS_SOURCE_TYPE_SDK",
        localName: "SDK"
    }
]);
const dist_RoomCompositeEgressRequest = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.RoomCompositeEgressRequest", ()=>[
        {
            no: 1,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "layout",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "audio_only",
            kind: "scalar",
            T: 8
        },
        {
            no: 15,
            name: "audio_mixing",
            kind: "enum",
            T: proto3_proto3.getEnumType(AudioMixing)
        },
        {
            no: 4,
            name: "video_only",
            kind: "scalar",
            T: 8
        },
        {
            no: 5,
            name: "custom_base_url",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "file",
            kind: "message",
            T: EncodedFileOutput,
            oneof: "output"
        },
        {
            no: 7,
            name: "stream",
            kind: "message",
            T: StreamOutput,
            oneof: "output"
        },
        {
            no: 10,
            name: "segments",
            kind: "message",
            T: SegmentedFileOutput,
            oneof: "output"
        },
        {
            no: 8,
            name: "preset",
            kind: "enum",
            T: proto3_proto3.getEnumType(EncodingOptionsPreset),
            oneof: "options"
        },
        {
            no: 9,
            name: "advanced",
            kind: "message",
            T: EncodingOptions,
            oneof: "options"
        },
        {
            no: 11,
            name: "file_outputs",
            kind: "message",
            T: EncodedFileOutput,
            repeated: true
        },
        {
            no: 12,
            name: "stream_outputs",
            kind: "message",
            T: StreamOutput,
            repeated: true
        },
        {
            no: 13,
            name: "segment_outputs",
            kind: "message",
            T: SegmentedFileOutput,
            repeated: true
        },
        {
            no: 14,
            name: "image_outputs",
            kind: "message",
            T: ImageOutput,
            repeated: true
        }
    ]);
const dist_WebEgressRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.WebEgressRequest", ()=>[
        {
            no: 1,
            name: "url",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "audio_only",
            kind: "scalar",
            T: 8
        },
        {
            no: 3,
            name: "video_only",
            kind: "scalar",
            T: 8
        },
        {
            no: 12,
            name: "await_start_signal",
            kind: "scalar",
            T: 8
        },
        {
            no: 4,
            name: "file",
            kind: "message",
            T: EncodedFileOutput,
            oneof: "output"
        },
        {
            no: 5,
            name: "stream",
            kind: "message",
            T: StreamOutput,
            oneof: "output"
        },
        {
            no: 6,
            name: "segments",
            kind: "message",
            T: SegmentedFileOutput,
            oneof: "output"
        },
        {
            no: 7,
            name: "preset",
            kind: "enum",
            T: proto3.getEnumType(EncodingOptionsPreset),
            oneof: "options"
        },
        {
            no: 8,
            name: "advanced",
            kind: "message",
            T: EncodingOptions,
            oneof: "options"
        },
        {
            no: 9,
            name: "file_outputs",
            kind: "message",
            T: EncodedFileOutput,
            repeated: true
        },
        {
            no: 10,
            name: "stream_outputs",
            kind: "message",
            T: StreamOutput,
            repeated: true
        },
        {
            no: 11,
            name: "segment_outputs",
            kind: "message",
            T: SegmentedFileOutput,
            repeated: true
        },
        {
            no: 13,
            name: "image_outputs",
            kind: "message",
            T: ImageOutput,
            repeated: true
        }
    ])));
const dist_ParticipantEgressRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ParticipantEgressRequest", ()=>[
        {
            no: 1,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "screen_share",
            kind: "scalar",
            T: 8
        },
        {
            no: 4,
            name: "preset",
            kind: "enum",
            T: proto3.getEnumType(EncodingOptionsPreset),
            oneof: "options"
        },
        {
            no: 5,
            name: "advanced",
            kind: "message",
            T: EncodingOptions,
            oneof: "options"
        },
        {
            no: 6,
            name: "file_outputs",
            kind: "message",
            T: EncodedFileOutput,
            repeated: true
        },
        {
            no: 7,
            name: "stream_outputs",
            kind: "message",
            T: StreamOutput,
            repeated: true
        },
        {
            no: 8,
            name: "segment_outputs",
            kind: "message",
            T: SegmentedFileOutput,
            repeated: true
        },
        {
            no: 9,
            name: "image_outputs",
            kind: "message",
            T: ImageOutput,
            repeated: true
        }
    ])));
const dist_TrackCompositeEgressRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.TrackCompositeEgressRequest", ()=>[
        {
            no: 1,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "audio_track_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "video_track_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "file",
            kind: "message",
            T: EncodedFileOutput,
            oneof: "output"
        },
        {
            no: 5,
            name: "stream",
            kind: "message",
            T: StreamOutput,
            oneof: "output"
        },
        {
            no: 8,
            name: "segments",
            kind: "message",
            T: SegmentedFileOutput,
            oneof: "output"
        },
        {
            no: 6,
            name: "preset",
            kind: "enum",
            T: proto3.getEnumType(EncodingOptionsPreset),
            oneof: "options"
        },
        {
            no: 7,
            name: "advanced",
            kind: "message",
            T: EncodingOptions,
            oneof: "options"
        },
        {
            no: 11,
            name: "file_outputs",
            kind: "message",
            T: EncodedFileOutput,
            repeated: true
        },
        {
            no: 12,
            name: "stream_outputs",
            kind: "message",
            T: StreamOutput,
            repeated: true
        },
        {
            no: 13,
            name: "segment_outputs",
            kind: "message",
            T: SegmentedFileOutput,
            repeated: true
        },
        {
            no: 14,
            name: "image_outputs",
            kind: "message",
            T: ImageOutput,
            repeated: true
        }
    ])));
const dist_TrackEgressRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.TrackEgressRequest", ()=>[
        {
            no: 1,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "track_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "file",
            kind: "message",
            T: DirectFileOutput,
            oneof: "output"
        },
        {
            no: 4,
            name: "websocket_url",
            kind: "scalar",
            T: 9,
            oneof: "output"
        }
    ])));
const EncodedFileOutput = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.EncodedFileOutput", ()=>[
        {
            no: 1,
            name: "file_type",
            kind: "enum",
            T: proto3_proto3.getEnumType(EncodedFileType)
        },
        {
            no: 2,
            name: "filepath",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "disable_manifest",
            kind: "scalar",
            T: 8
        },
        {
            no: 3,
            name: "s3",
            kind: "message",
            T: S3Upload,
            oneof: "output"
        },
        {
            no: 4,
            name: "gcp",
            kind: "message",
            T: GCPUpload,
            oneof: "output"
        },
        {
            no: 5,
            name: "azure",
            kind: "message",
            T: AzureBlobUpload,
            oneof: "output"
        },
        {
            no: 7,
            name: "aliOSS",
            kind: "message",
            T: AliOSSUpload,
            oneof: "output"
        }
    ]);
const SegmentedFileOutput = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.SegmentedFileOutput", ()=>[
        {
            no: 1,
            name: "protocol",
            kind: "enum",
            T: proto3_proto3.getEnumType(SegmentedFileProtocol)
        },
        {
            no: 2,
            name: "filename_prefix",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "playlist_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 11,
            name: "live_playlist_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "segment_duration",
            kind: "scalar",
            T: 13
        },
        {
            no: 10,
            name: "filename_suffix",
            kind: "enum",
            T: proto3_proto3.getEnumType(SegmentedFileSuffix)
        },
        {
            no: 8,
            name: "disable_manifest",
            kind: "scalar",
            T: 8
        },
        {
            no: 5,
            name: "s3",
            kind: "message",
            T: S3Upload,
            oneof: "output"
        },
        {
            no: 6,
            name: "gcp",
            kind: "message",
            T: GCPUpload,
            oneof: "output"
        },
        {
            no: 7,
            name: "azure",
            kind: "message",
            T: AzureBlobUpload,
            oneof: "output"
        },
        {
            no: 9,
            name: "aliOSS",
            kind: "message",
            T: AliOSSUpload,
            oneof: "output"
        }
    ]);
const DirectFileOutput = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.DirectFileOutput", ()=>[
        {
            no: 1,
            name: "filepath",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "disable_manifest",
            kind: "scalar",
            T: 8
        },
        {
            no: 2,
            name: "s3",
            kind: "message",
            T: S3Upload,
            oneof: "output"
        },
        {
            no: 3,
            name: "gcp",
            kind: "message",
            T: GCPUpload,
            oneof: "output"
        },
        {
            no: 4,
            name: "azure",
            kind: "message",
            T: AzureBlobUpload,
            oneof: "output"
        },
        {
            no: 6,
            name: "aliOSS",
            kind: "message",
            T: AliOSSUpload,
            oneof: "output"
        }
    ])));
const ImageOutput = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.ImageOutput", ()=>[
        {
            no: 1,
            name: "capture_interval",
            kind: "scalar",
            T: 13
        },
        {
            no: 2,
            name: "width",
            kind: "scalar",
            T: 5
        },
        {
            no: 3,
            name: "height",
            kind: "scalar",
            T: 5
        },
        {
            no: 4,
            name: "filename_prefix",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "filename_suffix",
            kind: "enum",
            T: proto3_proto3.getEnumType(ImageFileSuffix)
        },
        {
            no: 6,
            name: "image_codec",
            kind: "enum",
            T: proto3_proto3.getEnumType(ImageCodec)
        },
        {
            no: 7,
            name: "disable_manifest",
            kind: "scalar",
            T: 8
        },
        {
            no: 8,
            name: "s3",
            kind: "message",
            T: S3Upload,
            oneof: "output"
        },
        {
            no: 9,
            name: "gcp",
            kind: "message",
            T: GCPUpload,
            oneof: "output"
        },
        {
            no: 10,
            name: "azure",
            kind: "message",
            T: AzureBlobUpload,
            oneof: "output"
        },
        {
            no: 11,
            name: "aliOSS",
            kind: "message",
            T: AliOSSUpload,
            oneof: "output"
        }
    ]);
const S3Upload = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.S3Upload", ()=>[
        {
            no: 1,
            name: "access_key",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "secret",
            kind: "scalar",
            T: 9
        },
        {
            no: 11,
            name: "session_token",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "region",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "endpoint",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "bucket",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "force_path_style",
            kind: "scalar",
            T: 8
        },
        {
            no: 7,
            name: "metadata",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 8,
            name: "tagging",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "content_disposition",
            kind: "scalar",
            T: 9
        },
        {
            no: 10,
            name: "proxy",
            kind: "message",
            T: ProxyConfig
        }
    ]);
const GCPUpload = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.GCPUpload", ()=>[
        {
            no: 1,
            name: "credentials",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "bucket",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "proxy",
            kind: "message",
            T: ProxyConfig
        }
    ]);
const AzureBlobUpload = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.AzureBlobUpload", ()=>[
        {
            no: 1,
            name: "account_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "account_key",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "container_name",
            kind: "scalar",
            T: 9
        }
    ]);
const AliOSSUpload = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.AliOSSUpload", ()=>[
        {
            no: 1,
            name: "access_key",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "secret",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "region",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "endpoint",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "bucket",
            kind: "scalar",
            T: 9
        }
    ]);
const ProxyConfig = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.ProxyConfig", ()=>[
        {
            no: 1,
            name: "url",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "username",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "password",
            kind: "scalar",
            T: 9
        }
    ]);
const StreamOutput = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.StreamOutput", ()=>[
        {
            no: 1,
            name: "protocol",
            kind: "enum",
            T: proto3_proto3.getEnumType(StreamProtocol)
        },
        {
            no: 2,
            name: "urls",
            kind: "scalar",
            T: 9,
            repeated: true
        }
    ]);
const EncodingOptions = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.EncodingOptions", ()=>[
        {
            no: 1,
            name: "width",
            kind: "scalar",
            T: 5
        },
        {
            no: 2,
            name: "height",
            kind: "scalar",
            T: 5
        },
        {
            no: 3,
            name: "depth",
            kind: "scalar",
            T: 5
        },
        {
            no: 4,
            name: "framerate",
            kind: "scalar",
            T: 5
        },
        {
            no: 5,
            name: "audio_codec",
            kind: "enum",
            T: proto3_proto3.getEnumType(AudioCodec)
        },
        {
            no: 6,
            name: "audio_bitrate",
            kind: "scalar",
            T: 5
        },
        {
            no: 11,
            name: "audio_quality",
            kind: "scalar",
            T: 5
        },
        {
            no: 7,
            name: "audio_frequency",
            kind: "scalar",
            T: 5
        },
        {
            no: 8,
            name: "video_codec",
            kind: "enum",
            T: proto3_proto3.getEnumType(VideoCodec)
        },
        {
            no: 9,
            name: "video_bitrate",
            kind: "scalar",
            T: 5
        },
        {
            no: 12,
            name: "video_quality",
            kind: "scalar",
            T: 5
        },
        {
            no: 10,
            name: "key_frame_interval",
            kind: "scalar",
            T: 1
        }
    ]);
const dist_UpdateLayoutRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateLayoutRequest", ()=>[
        {
            no: 1,
            name: "egress_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "layout",
            kind: "scalar",
            T: 9
        }
    ])));
const dist_UpdateStreamRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateStreamRequest", ()=>[
        {
            no: 1,
            name: "egress_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "add_output_urls",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 3,
            name: "remove_output_urls",
            kind: "scalar",
            T: 9,
            repeated: true
        }
    ])));
const dist_ListEgressRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListEgressRequest", ()=>[
        {
            no: 1,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "egress_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "active",
            kind: "scalar",
            T: 8
        }
    ])));
const dist_ListEgressResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListEgressResponse", ()=>[
        {
            no: 1,
            name: "items",
            kind: "message",
            T: dist_EgressInfo,
            repeated: true
        }
    ])));
const dist_StopEgressRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.StopEgressRequest", ()=>[
        {
            no: 1,
            name: "egress_id",
            kind: "scalar",
            T: 9
        }
    ])));
const dist_EgressInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.EgressInfo", ()=>[
        {
            no: 1,
            name: "egress_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "room_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 13,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 26,
            name: "source_type",
            kind: "enum",
            T: proto3.getEnumType(EgressSourceType)
        },
        {
            no: 3,
            name: "status",
            kind: "enum",
            T: proto3.getEnumType(EgressStatus)
        },
        {
            no: 10,
            name: "started_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 11,
            name: "ended_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 18,
            name: "updated_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 21,
            name: "details",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "error",
            kind: "scalar",
            T: 9
        },
        {
            no: 22,
            name: "error_code",
            kind: "scalar",
            T: 5
        },
        {
            no: 4,
            name: "room_composite",
            kind: "message",
            T: dist_RoomCompositeEgressRequest,
            oneof: "request"
        },
        {
            no: 14,
            name: "web",
            kind: "message",
            T: dist_WebEgressRequest,
            oneof: "request"
        },
        {
            no: 19,
            name: "participant",
            kind: "message",
            T: dist_ParticipantEgressRequest,
            oneof: "request"
        },
        {
            no: 5,
            name: "track_composite",
            kind: "message",
            T: dist_TrackCompositeEgressRequest,
            oneof: "request"
        },
        {
            no: 6,
            name: "track",
            kind: "message",
            T: dist_TrackEgressRequest,
            oneof: "request"
        },
        {
            no: 7,
            name: "stream",
            kind: "message",
            T: StreamInfoList,
            oneof: "result"
        },
        {
            no: 8,
            name: "file",
            kind: "message",
            T: FileInfo,
            oneof: "result"
        },
        {
            no: 12,
            name: "segments",
            kind: "message",
            T: SegmentsInfo,
            oneof: "result"
        },
        {
            no: 15,
            name: "stream_results",
            kind: "message",
            T: StreamInfo,
            repeated: true
        },
        {
            no: 16,
            name: "file_results",
            kind: "message",
            T: FileInfo,
            repeated: true
        },
        {
            no: 17,
            name: "segment_results",
            kind: "message",
            T: SegmentsInfo,
            repeated: true
        },
        {
            no: 20,
            name: "image_results",
            kind: "message",
            T: ImagesInfo,
            repeated: true
        },
        {
            no: 23,
            name: "manifest_location",
            kind: "scalar",
            T: 9
        },
        {
            no: 25,
            name: "backup_storage_used",
            kind: "scalar",
            T: 8
        }
    ])));
const StreamInfoList = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.StreamInfoList", ()=>[
        {
            no: 1,
            name: "info",
            kind: "message",
            T: StreamInfo,
            repeated: true
        }
    ])));
const StreamInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.StreamInfo", ()=>[
        {
            no: 1,
            name: "url",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "started_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 3,
            name: "ended_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 4,
            name: "duration",
            kind: "scalar",
            T: 3
        },
        {
            no: 5,
            name: "status",
            kind: "enum",
            T: proto3.getEnumType(StreamInfo_Status)
        },
        {
            no: 6,
            name: "error",
            kind: "scalar",
            T: 9
        }
    ])));
const StreamInfo_Status = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.StreamInfo.Status", [
    {
        no: 0,
        name: "ACTIVE"
    },
    {
        no: 1,
        name: "FINISHED"
    },
    {
        no: 2,
        name: "FAILED"
    }
]);
const FileInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.FileInfo", ()=>[
        {
            no: 1,
            name: "filename",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "started_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 3,
            name: "ended_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 6,
            name: "duration",
            kind: "scalar",
            T: 3
        },
        {
            no: 4,
            name: "size",
            kind: "scalar",
            T: 3
        },
        {
            no: 5,
            name: "location",
            kind: "scalar",
            T: 9
        }
    ])));
const SegmentsInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SegmentsInfo", ()=>[
        {
            no: 1,
            name: "playlist_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "live_playlist_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "duration",
            kind: "scalar",
            T: 3
        },
        {
            no: 3,
            name: "size",
            kind: "scalar",
            T: 3
        },
        {
            no: 4,
            name: "playlist_location",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "live_playlist_location",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "segment_count",
            kind: "scalar",
            T: 3
        },
        {
            no: 6,
            name: "started_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 7,
            name: "ended_at",
            kind: "scalar",
            T: 3
        }
    ])));
const ImagesInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ImagesInfo", ()=>[
        {
            no: 4,
            name: "filename_prefix",
            kind: "scalar",
            T: 9
        },
        {
            no: 1,
            name: "image_count",
            kind: "scalar",
            T: 3
        },
        {
            no: 2,
            name: "started_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 3,
            name: "ended_at",
            kind: "scalar",
            T: 3
        }
    ])));
const AutoParticipantEgress = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.AutoParticipantEgress", ()=>[
        {
            no: 1,
            name: "preset",
            kind: "enum",
            T: proto3_proto3.getEnumType(EncodingOptionsPreset),
            oneof: "options"
        },
        {
            no: 2,
            name: "advanced",
            kind: "message",
            T: EncodingOptions,
            oneof: "options"
        },
        {
            no: 3,
            name: "file_outputs",
            kind: "message",
            T: EncodedFileOutput,
            repeated: true
        },
        {
            no: 4,
            name: "segment_outputs",
            kind: "message",
            T: SegmentedFileOutput,
            repeated: true
        }
    ]);
const AutoTrackEgress = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.AutoTrackEgress", ()=>[
        {
            no: 1,
            name: "filepath",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "disable_manifest",
            kind: "scalar",
            T: 8
        },
        {
            no: 2,
            name: "s3",
            kind: "message",
            T: S3Upload,
            oneof: "output"
        },
        {
            no: 3,
            name: "gcp",
            kind: "message",
            T: GCPUpload,
            oneof: "output"
        },
        {
            no: 4,
            name: "azure",
            kind: "message",
            T: AzureBlobUpload,
            oneof: "output"
        },
        {
            no: 6,
            name: "aliOSS",
            kind: "message",
            T: AliOSSUpload,
            oneof: "output"
        }
    ]);
const IngressInput = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.IngressInput", [
    {
        no: 0,
        name: "RTMP_INPUT"
    },
    {
        no: 1,
        name: "WHIP_INPUT"
    },
    {
        no: 2,
        name: "URL_INPUT"
    }
]);
const IngressAudioEncodingPreset = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.IngressAudioEncodingPreset", [
    {
        no: 0,
        name: "OPUS_STEREO_96KBPS"
    },
    {
        no: 1,
        name: "OPUS_MONO_64KBS"
    }
]);
const IngressVideoEncodingPreset = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.IngressVideoEncodingPreset", [
    {
        no: 0,
        name: "H264_720P_30FPS_3_LAYERS"
    },
    {
        no: 1,
        name: "H264_1080P_30FPS_3_LAYERS"
    },
    {
        no: 2,
        name: "H264_540P_25FPS_2_LAYERS"
    },
    {
        no: 3,
        name: "H264_720P_30FPS_1_LAYER"
    },
    {
        no: 4,
        name: "H264_1080P_30FPS_1_LAYER"
    },
    {
        no: 5,
        name: "H264_720P_30FPS_3_LAYERS_HIGH_MOTION"
    },
    {
        no: 6,
        name: "H264_1080P_30FPS_3_LAYERS_HIGH_MOTION"
    },
    {
        no: 7,
        name: "H264_540P_25FPS_2_LAYERS_HIGH_MOTION"
    },
    {
        no: 8,
        name: "H264_720P_30FPS_1_LAYER_HIGH_MOTION"
    },
    {
        no: 9,
        name: "H264_1080P_30FPS_1_LAYER_HIGH_MOTION"
    }
]);
const dist_CreateIngressRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.CreateIngressRequest", ()=>[
        {
            no: 1,
            name: "input_type",
            kind: "enum",
            T: proto3.getEnumType(IngressInput)
        },
        {
            no: 9,
            name: "url",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "participant_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 10,
            name: "participant_metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "bypass_transcoding",
            kind: "scalar",
            T: 8
        },
        {
            no: 11,
            name: "enable_transcoding",
            kind: "scalar",
            T: 8,
            opt: true
        },
        {
            no: 6,
            name: "audio",
            kind: "message",
            T: IngressAudioOptions
        },
        {
            no: 7,
            name: "video",
            kind: "message",
            T: IngressVideoOptions
        },
        {
            no: 12,
            name: "enabled",
            kind: "scalar",
            T: 8,
            opt: true
        }
    ])));
const IngressAudioOptions = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.IngressAudioOptions", ()=>[
        {
            no: 1,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "source",
            kind: "enum",
            T: proto3.getEnumType(TrackSource)
        },
        {
            no: 3,
            name: "preset",
            kind: "enum",
            T: proto3.getEnumType(IngressAudioEncodingPreset),
            oneof: "encoding_options"
        },
        {
            no: 4,
            name: "options",
            kind: "message",
            T: IngressAudioEncodingOptions,
            oneof: "encoding_options"
        }
    ])));
const IngressVideoOptions = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.IngressVideoOptions", ()=>[
        {
            no: 1,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "source",
            kind: "enum",
            T: proto3.getEnumType(TrackSource)
        },
        {
            no: 3,
            name: "preset",
            kind: "enum",
            T: proto3.getEnumType(IngressVideoEncodingPreset),
            oneof: "encoding_options"
        },
        {
            no: 4,
            name: "options",
            kind: "message",
            T: IngressVideoEncodingOptions,
            oneof: "encoding_options"
        }
    ])));
const IngressAudioEncodingOptions = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.IngressAudioEncodingOptions", ()=>[
        {
            no: 1,
            name: "audio_codec",
            kind: "enum",
            T: proto3.getEnumType(AudioCodec)
        },
        {
            no: 2,
            name: "bitrate",
            kind: "scalar",
            T: 13
        },
        {
            no: 3,
            name: "disable_dtx",
            kind: "scalar",
            T: 8
        },
        {
            no: 4,
            name: "channels",
            kind: "scalar",
            T: 13
        }
    ])));
const IngressVideoEncodingOptions = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.IngressVideoEncodingOptions", ()=>[
        {
            no: 1,
            name: "video_codec",
            kind: "enum",
            T: proto3.getEnumType(VideoCodec)
        },
        {
            no: 2,
            name: "frame_rate",
            kind: "scalar",
            T: 1
        },
        {
            no: 3,
            name: "layers",
            kind: "message",
            T: VideoLayer,
            repeated: true
        }
    ])));
const dist_IngressInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.IngressInfo", ()=>[
        {
            no: 1,
            name: "ingress_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "stream_key",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "url",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "input_type",
            kind: "enum",
            T: proto3.getEnumType(IngressInput)
        },
        {
            no: 13,
            name: "bypass_transcoding",
            kind: "scalar",
            T: 8
        },
        {
            no: 15,
            name: "enable_transcoding",
            kind: "scalar",
            T: 8,
            opt: true
        },
        {
            no: 6,
            name: "audio",
            kind: "message",
            T: IngressAudioOptions
        },
        {
            no: 7,
            name: "video",
            kind: "message",
            T: IngressVideoOptions
        },
        {
            no: 8,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 10,
            name: "participant_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 14,
            name: "participant_metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 11,
            name: "reusable",
            kind: "scalar",
            T: 8
        },
        {
            no: 12,
            name: "state",
            kind: "message",
            T: IngressState
        },
        {
            no: 16,
            name: "enabled",
            kind: "scalar",
            T: 8,
            opt: true
        }
    ])));
const IngressState = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.IngressState", ()=>[
        {
            no: 1,
            name: "status",
            kind: "enum",
            T: proto3.getEnumType(IngressState_Status)
        },
        {
            no: 2,
            name: "error",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "video",
            kind: "message",
            T: InputVideoState
        },
        {
            no: 4,
            name: "audio",
            kind: "message",
            T: InputAudioState
        },
        {
            no: 5,
            name: "room_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 7,
            name: "started_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 8,
            name: "ended_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 10,
            name: "updated_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 9,
            name: "resource_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "tracks",
            kind: "message",
            T: TrackInfo,
            repeated: true
        }
    ])));
const IngressState_Status = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.IngressState.Status", [
    {
        no: 0,
        name: "ENDPOINT_INACTIVE"
    },
    {
        no: 1,
        name: "ENDPOINT_BUFFERING"
    },
    {
        no: 2,
        name: "ENDPOINT_PUBLISHING"
    },
    {
        no: 3,
        name: "ENDPOINT_ERROR"
    },
    {
        no: 4,
        name: "ENDPOINT_COMPLETE"
    }
]);
const InputVideoState = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.InputVideoState", ()=>[
        {
            no: 1,
            name: "mime_type",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "average_bitrate",
            kind: "scalar",
            T: 13
        },
        {
            no: 3,
            name: "width",
            kind: "scalar",
            T: 13
        },
        {
            no: 4,
            name: "height",
            kind: "scalar",
            T: 13
        },
        {
            no: 5,
            name: "framerate",
            kind: "scalar",
            T: 1
        }
    ])));
const InputAudioState = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.InputAudioState", ()=>[
        {
            no: 1,
            name: "mime_type",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "average_bitrate",
            kind: "scalar",
            T: 13
        },
        {
            no: 3,
            name: "channels",
            kind: "scalar",
            T: 13
        },
        {
            no: 4,
            name: "sample_rate",
            kind: "scalar",
            T: 13
        }
    ])));
const dist_UpdateIngressRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateIngressRequest", ()=>[
        {
            no: 1,
            name: "ingress_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "participant_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "participant_metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "bypass_transcoding",
            kind: "scalar",
            T: 8,
            opt: true
        },
        {
            no: 10,
            name: "enable_transcoding",
            kind: "scalar",
            T: 8,
            opt: true
        },
        {
            no: 6,
            name: "audio",
            kind: "message",
            T: IngressAudioOptions
        },
        {
            no: 7,
            name: "video",
            kind: "message",
            T: IngressVideoOptions
        },
        {
            no: 11,
            name: "enabled",
            kind: "scalar",
            T: 8,
            opt: true
        }
    ])));
const dist_ListIngressRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListIngressRequest", ()=>[
        {
            no: 1,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "ingress_id",
            kind: "scalar",
            T: 9
        }
    ])));
const dist_ListIngressResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListIngressResponse", ()=>[
        {
            no: 1,
            name: "items",
            kind: "message",
            T: dist_IngressInfo,
            repeated: true
        }
    ])));
const dist_DeleteIngressRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.DeleteIngressRequest", ()=>[
        {
            no: 1,
            name: "ingress_id",
            kind: "scalar",
            T: 9
        }
    ])));
const CreateRoomRequest = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.CreateRoomRequest", ()=>[
        {
            no: 1,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 12,
            name: "room_preset",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "empty_timeout",
            kind: "scalar",
            T: 13
        },
        {
            no: 10,
            name: "departure_timeout",
            kind: "scalar",
            T: 13
        },
        {
            no: 3,
            name: "max_participants",
            kind: "scalar",
            T: 13
        },
        {
            no: 4,
            name: "node_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "egress",
            kind: "message",
            T: RoomEgress
        },
        {
            no: 7,
            name: "min_playout_delay",
            kind: "scalar",
            T: 13
        },
        {
            no: 8,
            name: "max_playout_delay",
            kind: "scalar",
            T: 13
        },
        {
            no: 9,
            name: "sync_streams",
            kind: "scalar",
            T: 8
        },
        {
            no: 13,
            name: "replay_enabled",
            kind: "scalar",
            T: 8
        },
        {
            no: 14,
            name: "agents",
            kind: "message",
            T: RoomAgentDispatch,
            repeated: true
        }
    ]);
const RoomEgress = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.RoomEgress", ()=>[
        {
            no: 1,
            name: "room",
            kind: "message",
            T: dist_RoomCompositeEgressRequest
        },
        {
            no: 3,
            name: "participant",
            kind: "message",
            T: AutoParticipantEgress
        },
        {
            no: 2,
            name: "tracks",
            kind: "message",
            T: AutoTrackEgress
        }
    ]);
const RoomAgent = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RoomAgent", ()=>[
        {
            no: 1,
            name: "dispatches",
            kind: "message",
            T: RoomAgentDispatch,
            repeated: true
        }
    ])));
const ListRoomsRequest = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.ListRoomsRequest", ()=>[
        {
            no: 1,
            name: "names",
            kind: "scalar",
            T: 9,
            repeated: true
        }
    ]);
const ListRoomsResponse = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.ListRoomsResponse", ()=>[
        {
            no: 1,
            name: "rooms",
            kind: "message",
            T: Room,
            repeated: true
        }
    ]);
const DeleteRoomRequest = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.DeleteRoomRequest", ()=>[
        {
            no: 1,
            name: "room",
            kind: "scalar",
            T: 9
        }
    ]);
const DeleteRoomResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.DeleteRoomResponse", [])));
const ListParticipantsRequest = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.ListParticipantsRequest", ()=>[
        {
            no: 1,
            name: "room",
            kind: "scalar",
            T: 9
        }
    ]);
const ListParticipantsResponse = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.ListParticipantsResponse", ()=>[
        {
            no: 1,
            name: "participants",
            kind: "message",
            T: ParticipantInfo,
            repeated: true
        }
    ]);
const RoomParticipantIdentity = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.RoomParticipantIdentity", ()=>[
        {
            no: 1,
            name: "room",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "identity",
            kind: "scalar",
            T: 9
        }
    ]);
const RemoveParticipantResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RemoveParticipantResponse", [])));
const MuteRoomTrackRequest = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.MuteRoomTrackRequest", ()=>[
        {
            no: 1,
            name: "room",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "track_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "muted",
            kind: "scalar",
            T: 8
        }
    ]);
const MuteRoomTrackResponse = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.MuteRoomTrackResponse", ()=>[
        {
            no: 1,
            name: "track",
            kind: "message",
            T: TrackInfo
        }
    ]);
const UpdateParticipantRequest = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.UpdateParticipantRequest", ()=>[
        {
            no: 1,
            name: "room",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "permission",
            kind: "message",
            T: ParticipantPermission
        },
        {
            no: 5,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        }
    ]);
const UpdateSubscriptionsRequest = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.UpdateSubscriptionsRequest", ()=>[
        {
            no: 1,
            name: "room",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "track_sids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 4,
            name: "subscribe",
            kind: "scalar",
            T: 8
        },
        {
            no: 5,
            name: "participant_tracks",
            kind: "message",
            T: ParticipantTracks,
            repeated: true
        }
    ]);
const UpdateSubscriptionsResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateSubscriptionsResponse", [])));
const SendDataRequest = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.SendDataRequest", ()=>[
        {
            no: 1,
            name: "room",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "data",
            kind: "scalar",
            T: 12
        },
        {
            no: 3,
            name: "kind",
            kind: "enum",
            T: proto3_proto3.getEnumType(DataPacket_Kind)
        },
        {
            no: 4,
            name: "destination_sids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 6,
            name: "destination_identities",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 5,
            name: "topic",
            kind: "scalar",
            T: 9,
            opt: true
        },
        {
            no: 7,
            name: "nonce",
            kind: "scalar",
            T: 12
        }
    ]);
const SendDataResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SendDataResponse", [])));
const UpdateRoomMetadataRequest = /* @__PURE__ */ proto3_proto3.makeMessageType("livekit.UpdateRoomMetadataRequest", ()=>[
        {
            no: 1,
            name: "room",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "metadata",
            kind: "scalar",
            T: 9
        }
    ]);
const RoomConfiguration = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RoomConfiguration", ()=>[
        {
            no: 1,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "empty_timeout",
            kind: "scalar",
            T: 13
        },
        {
            no: 3,
            name: "departure_timeout",
            kind: "scalar",
            T: 13
        },
        {
            no: 4,
            name: "max_participants",
            kind: "scalar",
            T: 13
        },
        {
            no: 5,
            name: "egress",
            kind: "message",
            T: RoomEgress
        },
        {
            no: 7,
            name: "min_playout_delay",
            kind: "scalar",
            T: 13
        },
        {
            no: 8,
            name: "max_playout_delay",
            kind: "scalar",
            T: 13
        },
        {
            no: 9,
            name: "sync_streams",
            kind: "scalar",
            T: 8
        },
        {
            no: 10,
            name: "agents",
            kind: "message",
            T: RoomAgentDispatch,
            repeated: true
        }
    ])));
const SignalTarget = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SignalTarget", [
    {
        no: 0,
        name: "PUBLISHER"
    },
    {
        no: 1,
        name: "SUBSCRIBER"
    }
]);
const StreamState = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.StreamState", [
    {
        no: 0,
        name: "ACTIVE"
    },
    {
        no: 1,
        name: "PAUSED"
    }
]);
const CandidateProtocol = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.CandidateProtocol", [
    {
        no: 0,
        name: "UDP"
    },
    {
        no: 1,
        name: "TCP"
    },
    {
        no: 2,
        name: "TLS"
    }
]);
const SignalRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SignalRequest", ()=>[
        {
            no: 1,
            name: "offer",
            kind: "message",
            T: SessionDescription,
            oneof: "message"
        },
        {
            no: 2,
            name: "answer",
            kind: "message",
            T: SessionDescription,
            oneof: "message"
        },
        {
            no: 3,
            name: "trickle",
            kind: "message",
            T: TrickleRequest,
            oneof: "message"
        },
        {
            no: 4,
            name: "add_track",
            kind: "message",
            T: AddTrackRequest,
            oneof: "message"
        },
        {
            no: 5,
            name: "mute",
            kind: "message",
            T: MuteTrackRequest,
            oneof: "message"
        },
        {
            no: 6,
            name: "subscription",
            kind: "message",
            T: UpdateSubscription,
            oneof: "message"
        },
        {
            no: 7,
            name: "track_setting",
            kind: "message",
            T: UpdateTrackSettings,
            oneof: "message"
        },
        {
            no: 8,
            name: "leave",
            kind: "message",
            T: LeaveRequest,
            oneof: "message"
        },
        {
            no: 10,
            name: "update_layers",
            kind: "message",
            T: UpdateVideoLayers,
            oneof: "message"
        },
        {
            no: 11,
            name: "subscription_permission",
            kind: "message",
            T: SubscriptionPermission,
            oneof: "message"
        },
        {
            no: 12,
            name: "sync_state",
            kind: "message",
            T: SyncState,
            oneof: "message"
        },
        {
            no: 13,
            name: "simulate",
            kind: "message",
            T: SimulateScenario,
            oneof: "message"
        },
        {
            no: 14,
            name: "ping",
            kind: "scalar",
            T: 3,
            oneof: "message"
        },
        {
            no: 15,
            name: "update_metadata",
            kind: "message",
            T: UpdateParticipantMetadata,
            oneof: "message"
        },
        {
            no: 16,
            name: "ping_req",
            kind: "message",
            T: Ping,
            oneof: "message"
        },
        {
            no: 17,
            name: "update_audio_track",
            kind: "message",
            T: UpdateLocalAudioTrack,
            oneof: "message"
        },
        {
            no: 18,
            name: "update_video_track",
            kind: "message",
            T: UpdateLocalVideoTrack,
            oneof: "message"
        }
    ])));
const SignalResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SignalResponse", ()=>[
        {
            no: 1,
            name: "join",
            kind: "message",
            T: JoinResponse,
            oneof: "message"
        },
        {
            no: 2,
            name: "answer",
            kind: "message",
            T: SessionDescription,
            oneof: "message"
        },
        {
            no: 3,
            name: "offer",
            kind: "message",
            T: SessionDescription,
            oneof: "message"
        },
        {
            no: 4,
            name: "trickle",
            kind: "message",
            T: TrickleRequest,
            oneof: "message"
        },
        {
            no: 5,
            name: "update",
            kind: "message",
            T: ParticipantUpdate,
            oneof: "message"
        },
        {
            no: 6,
            name: "track_published",
            kind: "message",
            T: TrackPublishedResponse,
            oneof: "message"
        },
        {
            no: 8,
            name: "leave",
            kind: "message",
            T: LeaveRequest,
            oneof: "message"
        },
        {
            no: 9,
            name: "mute",
            kind: "message",
            T: MuteTrackRequest,
            oneof: "message"
        },
        {
            no: 10,
            name: "speakers_changed",
            kind: "message",
            T: SpeakersChanged,
            oneof: "message"
        },
        {
            no: 11,
            name: "room_update",
            kind: "message",
            T: RoomUpdate,
            oneof: "message"
        },
        {
            no: 12,
            name: "connection_quality",
            kind: "message",
            T: ConnectionQualityUpdate,
            oneof: "message"
        },
        {
            no: 13,
            name: "stream_state_update",
            kind: "message",
            T: StreamStateUpdate,
            oneof: "message"
        },
        {
            no: 14,
            name: "subscribed_quality_update",
            kind: "message",
            T: SubscribedQualityUpdate,
            oneof: "message"
        },
        {
            no: 15,
            name: "subscription_permission_update",
            kind: "message",
            T: SubscriptionPermissionUpdate,
            oneof: "message"
        },
        {
            no: 16,
            name: "refresh_token",
            kind: "scalar",
            T: 9,
            oneof: "message"
        },
        {
            no: 17,
            name: "track_unpublished",
            kind: "message",
            T: TrackUnpublishedResponse,
            oneof: "message"
        },
        {
            no: 18,
            name: "pong",
            kind: "scalar",
            T: 3,
            oneof: "message"
        },
        {
            no: 19,
            name: "reconnect",
            kind: "message",
            T: ReconnectResponse,
            oneof: "message"
        },
        {
            no: 20,
            name: "pong_resp",
            kind: "message",
            T: Pong,
            oneof: "message"
        },
        {
            no: 21,
            name: "subscription_response",
            kind: "message",
            T: SubscriptionResponse,
            oneof: "message"
        },
        {
            no: 22,
            name: "request_response",
            kind: "message",
            T: RequestResponse,
            oneof: "message"
        },
        {
            no: 23,
            name: "track_subscribed",
            kind: "message",
            T: TrackSubscribed,
            oneof: "message"
        }
    ])));
const SimulcastCodec = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SimulcastCodec", ()=>[
        {
            no: 1,
            name: "codec",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "cid",
            kind: "scalar",
            T: 9
        }
    ])));
const AddTrackRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.AddTrackRequest", ()=>[
        {
            no: 1,
            name: "cid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "type",
            kind: "enum",
            T: proto3.getEnumType(TrackType)
        },
        {
            no: 4,
            name: "width",
            kind: "scalar",
            T: 13
        },
        {
            no: 5,
            name: "height",
            kind: "scalar",
            T: 13
        },
        {
            no: 6,
            name: "muted",
            kind: "scalar",
            T: 8
        },
        {
            no: 7,
            name: "disable_dtx",
            kind: "scalar",
            T: 8
        },
        {
            no: 8,
            name: "source",
            kind: "enum",
            T: proto3.getEnumType(TrackSource)
        },
        {
            no: 9,
            name: "layers",
            kind: "message",
            T: VideoLayer,
            repeated: true
        },
        {
            no: 10,
            name: "simulcast_codecs",
            kind: "message",
            T: SimulcastCodec,
            repeated: true
        },
        {
            no: 11,
            name: "sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 12,
            name: "stereo",
            kind: "scalar",
            T: 8
        },
        {
            no: 13,
            name: "disable_red",
            kind: "scalar",
            T: 8
        },
        {
            no: 14,
            name: "encryption",
            kind: "enum",
            T: proto3.getEnumType(Encryption_Type)
        },
        {
            no: 15,
            name: "stream",
            kind: "scalar",
            T: 9
        },
        {
            no: 16,
            name: "backup_codec_policy",
            kind: "enum",
            T: proto3.getEnumType(BackupCodecPolicy)
        }
    ])));
const TrickleRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.TrickleRequest", ()=>[
        {
            no: 1,
            name: "candidateInit",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "target",
            kind: "enum",
            T: proto3.getEnumType(SignalTarget)
        },
        {
            no: 3,
            name: "final",
            kind: "scalar",
            T: 8
        }
    ])));
const MuteTrackRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.MuteTrackRequest", ()=>[
        {
            no: 1,
            name: "sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "muted",
            kind: "scalar",
            T: 8
        }
    ])));
const JoinResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.JoinResponse", ()=>[
        {
            no: 1,
            name: "room",
            kind: "message",
            T: Room
        },
        {
            no: 2,
            name: "participant",
            kind: "message",
            T: ParticipantInfo
        },
        {
            no: 3,
            name: "other_participants",
            kind: "message",
            T: ParticipantInfo,
            repeated: true
        },
        {
            no: 4,
            name: "server_version",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "ice_servers",
            kind: "message",
            T: ICEServer,
            repeated: true
        },
        {
            no: 6,
            name: "subscriber_primary",
            kind: "scalar",
            T: 8
        },
        {
            no: 7,
            name: "alternative_url",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "client_configuration",
            kind: "message",
            T: ClientConfiguration
        },
        {
            no: 9,
            name: "server_region",
            kind: "scalar",
            T: 9
        },
        {
            no: 10,
            name: "ping_timeout",
            kind: "scalar",
            T: 5
        },
        {
            no: 11,
            name: "ping_interval",
            kind: "scalar",
            T: 5
        },
        {
            no: 12,
            name: "server_info",
            kind: "message",
            T: ServerInfo
        },
        {
            no: 13,
            name: "sif_trailer",
            kind: "scalar",
            T: 12
        },
        {
            no: 14,
            name: "enabled_publish_codecs",
            kind: "message",
            T: Codec,
            repeated: true
        },
        {
            no: 15,
            name: "fast_publish",
            kind: "scalar",
            T: 8
        }
    ])));
const ReconnectResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ReconnectResponse", ()=>[
        {
            no: 1,
            name: "ice_servers",
            kind: "message",
            T: ICEServer,
            repeated: true
        },
        {
            no: 2,
            name: "client_configuration",
            kind: "message",
            T: ClientConfiguration
        }
    ])));
const TrackPublishedResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.TrackPublishedResponse", ()=>[
        {
            no: 1,
            name: "cid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "track",
            kind: "message",
            T: TrackInfo
        }
    ])));
const TrackUnpublishedResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.TrackUnpublishedResponse", ()=>[
        {
            no: 1,
            name: "track_sid",
            kind: "scalar",
            T: 9
        }
    ])));
const SessionDescription = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SessionDescription", ()=>[
        {
            no: 1,
            name: "type",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "sdp",
            kind: "scalar",
            T: 9
        }
    ])));
const ParticipantUpdate = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ParticipantUpdate", ()=>[
        {
            no: 1,
            name: "participants",
            kind: "message",
            T: ParticipantInfo,
            repeated: true
        }
    ])));
const UpdateSubscription = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateSubscription", ()=>[
        {
            no: 1,
            name: "track_sids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 2,
            name: "subscribe",
            kind: "scalar",
            T: 8
        },
        {
            no: 3,
            name: "participant_tracks",
            kind: "message",
            T: ParticipantTracks,
            repeated: true
        }
    ])));
const UpdateTrackSettings = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateTrackSettings", ()=>[
        {
            no: 1,
            name: "track_sids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 3,
            name: "disabled",
            kind: "scalar",
            T: 8
        },
        {
            no: 4,
            name: "quality",
            kind: "enum",
            T: proto3.getEnumType(VideoQuality)
        },
        {
            no: 5,
            name: "width",
            kind: "scalar",
            T: 13
        },
        {
            no: 6,
            name: "height",
            kind: "scalar",
            T: 13
        },
        {
            no: 7,
            name: "fps",
            kind: "scalar",
            T: 13
        },
        {
            no: 8,
            name: "priority",
            kind: "scalar",
            T: 13
        }
    ])));
const UpdateLocalAudioTrack = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateLocalAudioTrack", ()=>[
        {
            no: 1,
            name: "track_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "features",
            kind: "enum",
            T: proto3.getEnumType(AudioTrackFeature),
            repeated: true
        }
    ])));
const UpdateLocalVideoTrack = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateLocalVideoTrack", ()=>[
        {
            no: 1,
            name: "track_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "width",
            kind: "scalar",
            T: 13
        },
        {
            no: 3,
            name: "height",
            kind: "scalar",
            T: 13
        }
    ])));
const LeaveRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.LeaveRequest", ()=>[
        {
            no: 1,
            name: "can_reconnect",
            kind: "scalar",
            T: 8
        },
        {
            no: 2,
            name: "reason",
            kind: "enum",
            T: proto3.getEnumType(DisconnectReason)
        },
        {
            no: 3,
            name: "action",
            kind: "enum",
            T: proto3.getEnumType(LeaveRequest_Action)
        },
        {
            no: 4,
            name: "regions",
            kind: "message",
            T: RegionSettings
        }
    ])));
const LeaveRequest_Action = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.LeaveRequest.Action", [
    {
        no: 0,
        name: "DISCONNECT"
    },
    {
        no: 1,
        name: "RESUME"
    },
    {
        no: 2,
        name: "RECONNECT"
    }
]);
const UpdateVideoLayers = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateVideoLayers", ()=>[
        {
            no: 1,
            name: "track_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "layers",
            kind: "message",
            T: VideoLayer,
            repeated: true
        }
    ])));
const UpdateParticipantMetadata = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.UpdateParticipantMetadata", ()=>[
        {
            no: 1,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 4,
            name: "request_id",
            kind: "scalar",
            T: 13
        }
    ])));
const ICEServer = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ICEServer", ()=>[
        {
            no: 1,
            name: "urls",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 2,
            name: "username",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "credential",
            kind: "scalar",
            T: 9
        }
    ])));
const SpeakersChanged = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SpeakersChanged", ()=>[
        {
            no: 1,
            name: "speakers",
            kind: "message",
            T: SpeakerInfo,
            repeated: true
        }
    ])));
const RoomUpdate = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RoomUpdate", ()=>[
        {
            no: 1,
            name: "room",
            kind: "message",
            T: Room
        }
    ])));
const ConnectionQualityInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ConnectionQualityInfo", ()=>[
        {
            no: 1,
            name: "participant_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "quality",
            kind: "enum",
            T: proto3.getEnumType(ConnectionQuality)
        },
        {
            no: 3,
            name: "score",
            kind: "scalar",
            T: 2
        }
    ])));
const ConnectionQualityUpdate = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ConnectionQualityUpdate", ()=>[
        {
            no: 1,
            name: "updates",
            kind: "message",
            T: ConnectionQualityInfo,
            repeated: true
        }
    ])));
const StreamStateInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.StreamStateInfo", ()=>[
        {
            no: 1,
            name: "participant_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "track_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "state",
            kind: "enum",
            T: proto3.getEnumType(StreamState)
        }
    ])));
const StreamStateUpdate = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.StreamStateUpdate", ()=>[
        {
            no: 1,
            name: "stream_states",
            kind: "message",
            T: StreamStateInfo,
            repeated: true
        }
    ])));
const SubscribedQuality = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SubscribedQuality", ()=>[
        {
            no: 1,
            name: "quality",
            kind: "enum",
            T: proto3.getEnumType(VideoQuality)
        },
        {
            no: 2,
            name: "enabled",
            kind: "scalar",
            T: 8
        }
    ])));
const SubscribedCodec = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SubscribedCodec", ()=>[
        {
            no: 1,
            name: "codec",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "qualities",
            kind: "message",
            T: SubscribedQuality,
            repeated: true
        }
    ])));
const SubscribedQualityUpdate = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SubscribedQualityUpdate", ()=>[
        {
            no: 1,
            name: "track_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "subscribed_qualities",
            kind: "message",
            T: SubscribedQuality,
            repeated: true
        },
        {
            no: 3,
            name: "subscribed_codecs",
            kind: "message",
            T: SubscribedCodec,
            repeated: true
        }
    ])));
const TrackPermission = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.TrackPermission", ()=>[
        {
            no: 1,
            name: "participant_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "all_tracks",
            kind: "scalar",
            T: 8
        },
        {
            no: 3,
            name: "track_sids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 4,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        }
    ])));
const SubscriptionPermission = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SubscriptionPermission", ()=>[
        {
            no: 1,
            name: "all_participants",
            kind: "scalar",
            T: 8
        },
        {
            no: 2,
            name: "track_permissions",
            kind: "message",
            T: TrackPermission,
            repeated: true
        }
    ])));
const SubscriptionPermissionUpdate = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SubscriptionPermissionUpdate", ()=>[
        {
            no: 1,
            name: "participant_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "track_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "allowed",
            kind: "scalar",
            T: 8
        }
    ])));
const SyncState = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SyncState", ()=>[
        {
            no: 1,
            name: "answer",
            kind: "message",
            T: SessionDescription
        },
        {
            no: 2,
            name: "subscription",
            kind: "message",
            T: UpdateSubscription
        },
        {
            no: 3,
            name: "publish_tracks",
            kind: "message",
            T: TrackPublishedResponse,
            repeated: true
        },
        {
            no: 4,
            name: "data_channels",
            kind: "message",
            T: DataChannelInfo,
            repeated: true
        },
        {
            no: 5,
            name: "offer",
            kind: "message",
            T: SessionDescription
        },
        {
            no: 6,
            name: "track_sids_disabled",
            kind: "scalar",
            T: 9,
            repeated: true
        }
    ])));
const DataChannelInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.DataChannelInfo", ()=>[
        {
            no: 1,
            name: "label",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "id",
            kind: "scalar",
            T: 13
        },
        {
            no: 3,
            name: "target",
            kind: "enum",
            T: proto3.getEnumType(SignalTarget)
        }
    ])));
const SimulateScenario = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SimulateScenario", ()=>[
        {
            no: 1,
            name: "speaker_update",
            kind: "scalar",
            T: 5,
            oneof: "scenario"
        },
        {
            no: 2,
            name: "node_failure",
            kind: "scalar",
            T: 8,
            oneof: "scenario"
        },
        {
            no: 3,
            name: "migration",
            kind: "scalar",
            T: 8,
            oneof: "scenario"
        },
        {
            no: 4,
            name: "server_leave",
            kind: "scalar",
            T: 8,
            oneof: "scenario"
        },
        {
            no: 5,
            name: "switch_candidate_protocol",
            kind: "enum",
            T: proto3.getEnumType(CandidateProtocol),
            oneof: "scenario"
        },
        {
            no: 6,
            name: "subscriber_bandwidth",
            kind: "scalar",
            T: 3,
            oneof: "scenario"
        },
        {
            no: 7,
            name: "disconnect_signal_on_resume",
            kind: "scalar",
            T: 8,
            oneof: "scenario"
        },
        {
            no: 8,
            name: "disconnect_signal_on_resume_no_messages",
            kind: "scalar",
            T: 8,
            oneof: "scenario"
        },
        {
            no: 9,
            name: "leave_request_full_reconnect",
            kind: "scalar",
            T: 8,
            oneof: "scenario"
        }
    ])));
const Ping = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.Ping", ()=>[
        {
            no: 1,
            name: "timestamp",
            kind: "scalar",
            T: 3
        },
        {
            no: 2,
            name: "rtt",
            kind: "scalar",
            T: 3
        }
    ])));
const Pong = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.Pong", ()=>[
        {
            no: 1,
            name: "last_ping_timestamp",
            kind: "scalar",
            T: 3
        },
        {
            no: 2,
            name: "timestamp",
            kind: "scalar",
            T: 3
        }
    ])));
const RegionSettings = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RegionSettings", ()=>[
        {
            no: 1,
            name: "regions",
            kind: "message",
            T: RegionInfo,
            repeated: true
        }
    ])));
const RegionInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RegionInfo", ()=>[
        {
            no: 1,
            name: "region",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "url",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "distance",
            kind: "scalar",
            T: 3
        }
    ])));
const SubscriptionResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SubscriptionResponse", ()=>[
        {
            no: 1,
            name: "track_sid",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "err",
            kind: "enum",
            T: proto3.getEnumType(SubscriptionError)
        }
    ])));
const RequestResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.RequestResponse", ()=>[
        {
            no: 1,
            name: "request_id",
            kind: "scalar",
            T: 13
        },
        {
            no: 2,
            name: "reason",
            kind: "enum",
            T: proto3.getEnumType(RequestResponse_Reason)
        },
        {
            no: 3,
            name: "message",
            kind: "scalar",
            T: 9
        }
    ])));
const RequestResponse_Reason = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.RequestResponse.Reason", [
    {
        no: 0,
        name: "OK"
    },
    {
        no: 1,
        name: "NOT_FOUND"
    },
    {
        no: 2,
        name: "NOT_ALLOWED"
    },
    {
        no: 3,
        name: "LIMIT_EXCEEDED"
    }
]);
const TrackSubscribed = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.TrackSubscribed", ()=>[
        {
            no: 1,
            name: "track_sid",
            kind: "scalar",
            T: 9
        }
    ])));
const SIPStatusCode = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SIPStatusCode", [
    {
        no: 0,
        name: "SIP_STATUS_UNKNOWN"
    },
    {
        no: 100,
        name: "SIP_STATUS_TRYING"
    },
    {
        no: 180,
        name: "SIP_STATUS_RINGING"
    },
    {
        no: 181,
        name: "SIP_STATUS_CALL_IS_FORWARDED"
    },
    {
        no: 182,
        name: "SIP_STATUS_QUEUED"
    },
    {
        no: 183,
        name: "SIP_STATUS_SESSION_PROGRESS"
    },
    {
        no: 200,
        name: "SIP_STATUS_OK"
    },
    {
        no: 202,
        name: "SIP_STATUS_ACCEPTED"
    },
    {
        no: 301,
        name: "SIP_STATUS_MOVED_PERMANENTLY"
    },
    {
        no: 302,
        name: "SIP_STATUS_MOVED_TEMPORARILY"
    },
    {
        no: 305,
        name: "SIP_STATUS_USE_PROXY"
    },
    {
        no: 400,
        name: "SIP_STATUS_BAD_REQUEST"
    },
    {
        no: 401,
        name: "SIP_STATUS_UNAUTHORIZED"
    },
    {
        no: 402,
        name: "SIP_STATUS_PAYMENT_REQUIRED"
    },
    {
        no: 403,
        name: "SIP_STATUS_FORBIDDEN"
    },
    {
        no: 404,
        name: "SIP_STATUS_NOTFOUND"
    },
    {
        no: 405,
        name: "SIP_STATUS_METHOD_NOT_ALLOWED"
    },
    {
        no: 406,
        name: "SIP_STATUS_NOT_ACCEPTABLE"
    },
    {
        no: 407,
        name: "SIP_STATUS_PROXY_AUTH_REQUIRED"
    },
    {
        no: 408,
        name: "SIP_STATUS_REQUEST_TIMEOUT"
    },
    {
        no: 409,
        name: "SIP_STATUS_CONFLICT"
    },
    {
        no: 410,
        name: "SIP_STATUS_GONE"
    },
    {
        no: 413,
        name: "SIP_STATUS_REQUEST_ENTITY_TOO_LARGE"
    },
    {
        no: 414,
        name: "SIP_STATUS_REQUEST_URI_TOO_LONG"
    },
    {
        no: 415,
        name: "SIP_STATUS_UNSUPPORTED_MEDIA_TYPE"
    },
    {
        no: 416,
        name: "SIP_STATUS_REQUESTED_RANGE_NOT_SATISFIABLE"
    },
    {
        no: 420,
        name: "SIP_STATUS_BAD_EXTENSION"
    },
    {
        no: 421,
        name: "SIP_STATUS_EXTENSION_REQUIRED"
    },
    {
        no: 423,
        name: "SIP_STATUS_INTERVAL_TOO_BRIEF"
    },
    {
        no: 480,
        name: "SIP_STATUS_TEMPORARILY_UNAVAILABLE"
    },
    {
        no: 481,
        name: "SIP_STATUS_CALL_TRANSACTION_DOES_NOT_EXISTS"
    },
    {
        no: 482,
        name: "SIP_STATUS_LOOP_DETECTED"
    },
    {
        no: 483,
        name: "SIP_STATUS_TOO_MANY_HOPS"
    },
    {
        no: 484,
        name: "SIP_STATUS_ADDRESS_INCOMPLETE"
    },
    {
        no: 485,
        name: "SIP_STATUS_AMBIGUOUS"
    },
    {
        no: 486,
        name: "SIP_STATUS_BUSY_HERE"
    },
    {
        no: 487,
        name: "SIP_STATUS_REQUEST_TERMINATED"
    },
    {
        no: 488,
        name: "SIP_STATUS_NOT_ACCEPTABLE_HERE"
    },
    {
        no: 500,
        name: "SIP_STATUS_INTERNAL_SERVER_ERROR"
    },
    {
        no: 501,
        name: "SIP_STATUS_NOT_IMPLEMENTED"
    },
    {
        no: 502,
        name: "SIP_STATUS_BAD_GATEWAY"
    },
    {
        no: 503,
        name: "SIP_STATUS_SERVICE_UNAVAILABLE"
    },
    {
        no: 504,
        name: "SIP_STATUS_GATEWAY_TIMEOUT"
    },
    {
        no: 505,
        name: "SIP_STATUS_VERSION_NOT_SUPPORTED"
    },
    {
        no: 513,
        name: "SIP_STATUS_MESSAGE_TOO_LARGE"
    },
    {
        no: 600,
        name: "SIP_STATUS_GLOBAL_BUSY_EVERYWHERE"
    },
    {
        no: 603,
        name: "SIP_STATUS_GLOBAL_DECLINE"
    },
    {
        no: 604,
        name: "SIP_STATUS_GLOBAL_DOES_NOT_EXIST_ANYWHERE"
    },
    {
        no: 606,
        name: "SIP_STATUS_GLOBAL_NOT_ACCEPTABLE"
    }
]);
const dist_SIPTransport = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SIPTransport", [
    {
        no: 0,
        name: "SIP_TRANSPORT_AUTO"
    },
    {
        no: 1,
        name: "SIP_TRANSPORT_UDP"
    },
    {
        no: 2,
        name: "SIP_TRANSPORT_TCP"
    },
    {
        no: 3,
        name: "SIP_TRANSPORT_TLS"
    }
]);
const SIPHeaderOptions = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SIPHeaderOptions", [
    {
        no: 0,
        name: "SIP_NO_HEADERS"
    },
    {
        no: 1,
        name: "SIP_X_HEADERS"
    },
    {
        no: 2,
        name: "SIP_ALL_HEADERS"
    }
]);
const SIPMediaEncryption = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SIPMediaEncryption", [
    {
        no: 0,
        name: "SIP_MEDIA_ENCRYPT_DISABLE"
    },
    {
        no: 1,
        name: "SIP_MEDIA_ENCRYPT_ALLOW"
    },
    {
        no: 2,
        name: "SIP_MEDIA_ENCRYPT_REQUIRE"
    }
]);
const SIPCallStatus = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SIPCallStatus", [
    {
        no: 0,
        name: "SCS_CALL_INCOMING"
    },
    {
        no: 1,
        name: "SCS_PARTICIPANT_JOINED"
    },
    {
        no: 2,
        name: "SCS_ACTIVE"
    },
    {
        no: 3,
        name: "SCS_DISCONNECTED"
    },
    {
        no: 4,
        name: "SCS_ERROR"
    }
]);
const SIPFeature = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SIPFeature", [
    {
        no: 0,
        name: "NONE"
    },
    {
        no: 1,
        name: "KRISP_ENABLED"
    }
]);
const SIPCallDirection = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SIPCallDirection", [
    {
        no: 0,
        name: "SCD_UNKNOWN"
    },
    {
        no: 1,
        name: "SCD_INBOUND"
    },
    {
        no: 2,
        name: "SCD_OUTBOUND"
    }
]);
const SIPStatus = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPStatus", ()=>[
        {
            no: 1,
            name: "code",
            kind: "enum",
            T: proto3.getEnumType(SIPStatusCode)
        },
        {
            no: 2,
            name: "status",
            kind: "scalar",
            T: 9
        }
    ])));
const dist_CreateSIPTrunkRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.CreateSIPTrunkRequest", ()=>[
        {
            no: 1,
            name: "inbound_addresses",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 2,
            name: "outbound_address",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "outbound_number",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "inbound_numbers_regex",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 9,
            name: "inbound_numbers",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 5,
            name: "inbound_username",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "inbound_password",
            kind: "scalar",
            T: 9
        },
        {
            no: 7,
            name: "outbound_username",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "outbound_password",
            kind: "scalar",
            T: 9
        },
        {
            no: 10,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 11,
            name: "metadata",
            kind: "scalar",
            T: 9
        }
    ])));
const dist_SIPTrunkInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPTrunkInfo", ()=>[
        {
            no: 1,
            name: "sip_trunk_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 14,
            name: "kind",
            kind: "enum",
            T: proto3.getEnumType(SIPTrunkInfo_TrunkKind)
        },
        {
            no: 2,
            name: "inbound_addresses",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 3,
            name: "outbound_address",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "outbound_number",
            kind: "scalar",
            T: 9
        },
        {
            no: 13,
            name: "transport",
            kind: "enum",
            T: proto3.getEnumType(dist_SIPTransport)
        },
        {
            no: 5,
            name: "inbound_numbers_regex",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 10,
            name: "inbound_numbers",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 6,
            name: "inbound_username",
            kind: "scalar",
            T: 9
        },
        {
            no: 7,
            name: "inbound_password",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "outbound_username",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "outbound_password",
            kind: "scalar",
            T: 9
        },
        {
            no: 11,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 12,
            name: "metadata",
            kind: "scalar",
            T: 9
        }
    ])));
const SIPTrunkInfo_TrunkKind = /* @__PURE__ */ proto3_proto3.makeEnum("livekit.SIPTrunkInfo.TrunkKind", [
    {
        no: 0,
        name: "TRUNK_LEGACY"
    },
    {
        no: 1,
        name: "TRUNK_INBOUND"
    },
    {
        no: 2,
        name: "TRUNK_OUTBOUND"
    }
]);
const dist_CreateSIPInboundTrunkRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.CreateSIPInboundTrunkRequest", ()=>[
        {
            no: 1,
            name: "trunk",
            kind: "message",
            T: dist_SIPInboundTrunkInfo
        }
    ])));
const dist_SIPInboundTrunkInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPInboundTrunkInfo", ()=>[
        {
            no: 1,
            name: "sip_trunk_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "numbers",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 5,
            name: "allowed_addresses",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 6,
            name: "allowed_numbers",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 7,
            name: "auth_username",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "auth_password",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "headers",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 10,
            name: "headers_to_attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 14,
            name: "attributes_to_headers",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 15,
            name: "include_headers",
            kind: "enum",
            T: proto3.getEnumType(SIPHeaderOptions)
        },
        {
            no: 11,
            name: "ringing_timeout",
            kind: "message",
            T: Duration
        },
        {
            no: 12,
            name: "max_call_duration",
            kind: "message",
            T: Duration
        },
        {
            no: 13,
            name: "krisp_enabled",
            kind: "scalar",
            T: 8
        },
        {
            no: 16,
            name: "media_encryption",
            kind: "enum",
            T: proto3.getEnumType(SIPMediaEncryption)
        }
    ])));
const dist_CreateSIPOutboundTrunkRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.CreateSIPOutboundTrunkRequest", ()=>[
        {
            no: 1,
            name: "trunk",
            kind: "message",
            T: dist_SIPOutboundTrunkInfo
        }
    ])));
const dist_SIPOutboundTrunkInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPOutboundTrunkInfo", ()=>[
        {
            no: 1,
            name: "sip_trunk_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "address",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "transport",
            kind: "enum",
            T: proto3.getEnumType(dist_SIPTransport)
        },
        {
            no: 6,
            name: "numbers",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 7,
            name: "auth_username",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "auth_password",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "headers",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 10,
            name: "headers_to_attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 11,
            name: "attributes_to_headers",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 12,
            name: "include_headers",
            kind: "enum",
            T: proto3.getEnumType(SIPHeaderOptions)
        },
        {
            no: 13,
            name: "media_encryption",
            kind: "enum",
            T: proto3.getEnumType(SIPMediaEncryption)
        }
    ])));
const GetSIPInboundTrunkRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.GetSIPInboundTrunkRequest", ()=>[
        {
            no: 1,
            name: "sip_trunk_id",
            kind: "scalar",
            T: 9
        }
    ])));
const GetSIPInboundTrunkResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.GetSIPInboundTrunkResponse", ()=>[
        {
            no: 1,
            name: "trunk",
            kind: "message",
            T: dist_SIPInboundTrunkInfo
        }
    ])));
const GetSIPOutboundTrunkRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.GetSIPOutboundTrunkRequest", ()=>[
        {
            no: 1,
            name: "sip_trunk_id",
            kind: "scalar",
            T: 9
        }
    ])));
const GetSIPOutboundTrunkResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.GetSIPOutboundTrunkResponse", ()=>[
        {
            no: 1,
            name: "trunk",
            kind: "message",
            T: dist_SIPOutboundTrunkInfo
        }
    ])));
const dist_ListSIPTrunkRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListSIPTrunkRequest", ()=>[
        {
            no: 1,
            name: "page",
            kind: "message",
            T: Pagination
        }
    ])));
const dist_ListSIPTrunkResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListSIPTrunkResponse", ()=>[
        {
            no: 1,
            name: "items",
            kind: "message",
            T: dist_SIPTrunkInfo,
            repeated: true
        }
    ])));
const dist_ListSIPInboundTrunkRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListSIPInboundTrunkRequest", ()=>[
        {
            no: 3,
            name: "page",
            kind: "message",
            T: Pagination
        },
        {
            no: 1,
            name: "trunk_ids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 2,
            name: "numbers",
            kind: "scalar",
            T: 9,
            repeated: true
        }
    ])));
const dist_ListSIPInboundTrunkResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListSIPInboundTrunkResponse", ()=>[
        {
            no: 1,
            name: "items",
            kind: "message",
            T: dist_SIPInboundTrunkInfo,
            repeated: true
        }
    ])));
const dist_ListSIPOutboundTrunkRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListSIPOutboundTrunkRequest", ()=>[
        {
            no: 3,
            name: "page",
            kind: "message",
            T: Pagination
        },
        {
            no: 1,
            name: "trunk_ids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 2,
            name: "numbers",
            kind: "scalar",
            T: 9,
            repeated: true
        }
    ])));
const dist_ListSIPOutboundTrunkResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListSIPOutboundTrunkResponse", ()=>[
        {
            no: 1,
            name: "items",
            kind: "message",
            T: dist_SIPOutboundTrunkInfo,
            repeated: true
        }
    ])));
const dist_DeleteSIPTrunkRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.DeleteSIPTrunkRequest", ()=>[
        {
            no: 1,
            name: "sip_trunk_id",
            kind: "scalar",
            T: 9
        }
    ])));
const dist_SIPDispatchRuleDirect = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPDispatchRuleDirect", ()=>[
        {
            no: 1,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "pin",
            kind: "scalar",
            T: 9
        }
    ])));
const dist_SIPDispatchRuleIndividual = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPDispatchRuleIndividual", ()=>[
        {
            no: 1,
            name: "room_prefix",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "pin",
            kind: "scalar",
            T: 9
        }
    ])));
const SIPDispatchRuleCallee = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPDispatchRuleCallee", ()=>[
        {
            no: 1,
            name: "room_prefix",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "pin",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "randomize",
            kind: "scalar",
            T: 8
        }
    ])));
const dist_SIPDispatchRule = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPDispatchRule", ()=>[
        {
            no: 1,
            name: "dispatch_rule_direct",
            kind: "message",
            T: dist_SIPDispatchRuleDirect,
            oneof: "rule"
        },
        {
            no: 2,
            name: "dispatch_rule_individual",
            kind: "message",
            T: dist_SIPDispatchRuleIndividual,
            oneof: "rule"
        },
        {
            no: 3,
            name: "dispatch_rule_callee",
            kind: "message",
            T: SIPDispatchRuleCallee,
            oneof: "rule"
        }
    ])));
const dist_CreateSIPDispatchRuleRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.CreateSIPDispatchRuleRequest", ()=>[
        {
            no: 1,
            name: "rule",
            kind: "message",
            T: dist_SIPDispatchRule
        },
        {
            no: 2,
            name: "trunk_ids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 3,
            name: "hide_phone_number",
            kind: "scalar",
            T: 8
        },
        {
            no: 6,
            name: "inbound_numbers",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 4,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 7,
            name: "attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 8,
            name: "room_preset",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "room_config",
            kind: "message",
            T: RoomConfiguration
        }
    ])));
const dist_SIPDispatchRuleInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPDispatchRuleInfo", ()=>[
        {
            no: 1,
            name: "sip_dispatch_rule_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "rule",
            kind: "message",
            T: dist_SIPDispatchRule
        },
        {
            no: 3,
            name: "trunk_ids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 4,
            name: "hide_phone_number",
            kind: "scalar",
            T: 8
        },
        {
            no: 7,
            name: "inbound_numbers",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 5,
            name: "name",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 9,
            name: "room_preset",
            kind: "scalar",
            T: 9
        },
        {
            no: 10,
            name: "room_config",
            kind: "message",
            T: RoomConfiguration
        },
        {
            no: 11,
            name: "krisp_enabled",
            kind: "scalar",
            T: 8
        },
        {
            no: 12,
            name: "media_encryption",
            kind: "enum",
            T: proto3.getEnumType(SIPMediaEncryption)
        }
    ])));
const dist_ListSIPDispatchRuleRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListSIPDispatchRuleRequest", ()=>[
        {
            no: 3,
            name: "page",
            kind: "message",
            T: Pagination
        },
        {
            no: 1,
            name: "dispatch_rule_ids",
            kind: "scalar",
            T: 9,
            repeated: true
        },
        {
            no: 2,
            name: "trunk_ids",
            kind: "scalar",
            T: 9,
            repeated: true
        }
    ])));
const dist_ListSIPDispatchRuleResponse = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.ListSIPDispatchRuleResponse", ()=>[
        {
            no: 1,
            name: "items",
            kind: "message",
            T: dist_SIPDispatchRuleInfo,
            repeated: true
        }
    ])));
const dist_DeleteSIPDispatchRuleRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.DeleteSIPDispatchRuleRequest", ()=>[
        {
            no: 1,
            name: "sip_dispatch_rule_id",
            kind: "scalar",
            T: 9
        }
    ])));
const SIPOutboundConfig = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPOutboundConfig", ()=>[
        {
            no: 1,
            name: "hostname",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "transport",
            kind: "enum",
            T: proto3.getEnumType(dist_SIPTransport)
        },
        {
            no: 3,
            name: "auth_username",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "auth_password",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "headers_to_attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 6,
            name: "attributes_to_headers",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        }
    ])));
const dist_CreateSIPParticipantRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.CreateSIPParticipantRequest", ()=>[
        {
            no: 1,
            name: "sip_trunk_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 20,
            name: "trunk",
            kind: "message",
            T: SIPOutboundConfig
        },
        {
            no: 2,
            name: "sip_call_to",
            kind: "scalar",
            T: 9
        },
        {
            no: 15,
            name: "sip_number",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 7,
            name: "participant_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 8,
            name: "participant_metadata",
            kind: "scalar",
            T: 9
        },
        {
            no: 9,
            name: "participant_attributes",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 5,
            name: "dtmf",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "play_ringtone",
            kind: "scalar",
            T: 8
        },
        {
            no: 13,
            name: "play_dialtone",
            kind: "scalar",
            T: 8
        },
        {
            no: 10,
            name: "hide_phone_number",
            kind: "scalar",
            T: 8
        },
        {
            no: 16,
            name: "headers",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        },
        {
            no: 17,
            name: "include_headers",
            kind: "enum",
            T: proto3.getEnumType(SIPHeaderOptions)
        },
        {
            no: 11,
            name: "ringing_timeout",
            kind: "message",
            T: Duration
        },
        {
            no: 12,
            name: "max_call_duration",
            kind: "message",
            T: Duration
        },
        {
            no: 14,
            name: "krisp_enabled",
            kind: "scalar",
            T: 8
        },
        {
            no: 18,
            name: "media_encryption",
            kind: "enum",
            T: proto3.getEnumType(SIPMediaEncryption)
        },
        {
            no: 19,
            name: "wait_until_answered",
            kind: "scalar",
            T: 8
        }
    ])));
const dist_SIPParticipantInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPParticipantInfo", ()=>[
        {
            no: 1,
            name: "participant_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "sip_call_id",
            kind: "scalar",
            T: 9
        }
    ])));
const dist_TransferSIPParticipantRequest = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.TransferSIPParticipantRequest", ()=>[
        {
            no: 1,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "transfer_to",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "play_dialtone",
            kind: "scalar",
            T: 8
        },
        {
            no: 5,
            name: "headers",
            kind: "map",
            K: 9,
            V: {
                kind: "scalar",
                T: 9
            }
        }
    ])));
const SIPCallInfo = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPCallInfo", ()=>[
        {
            no: 1,
            name: "call_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "trunk_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "room_name",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "room_id",
            kind: "scalar",
            T: 9
        },
        {
            no: 5,
            name: "participant_identity",
            kind: "scalar",
            T: 9
        },
        {
            no: 6,
            name: "from_uri",
            kind: "message",
            T: SIPUri
        },
        {
            no: 7,
            name: "to_uri",
            kind: "message",
            T: SIPUri
        },
        {
            no: 14,
            name: "enabled_features",
            kind: "enum",
            T: proto3.getEnumType(SIPFeature),
            repeated: true
        },
        {
            no: 15,
            name: "call_direction",
            kind: "enum",
            T: proto3.getEnumType(SIPCallDirection)
        },
        {
            no: 8,
            name: "call_status",
            kind: "enum",
            T: proto3.getEnumType(SIPCallStatus)
        },
        {
            no: 9,
            name: "created_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 10,
            name: "started_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 11,
            name: "ended_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 12,
            name: "disconnect_reason",
            kind: "enum",
            T: proto3.getEnumType(DisconnectReason)
        },
        {
            no: 13,
            name: "error",
            kind: "scalar",
            T: 9
        }
    ])));
const SIPUri = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.SIPUri", ()=>[
        {
            no: 1,
            name: "user",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "host",
            kind: "scalar",
            T: 9
        },
        {
            no: 3,
            name: "ip",
            kind: "scalar",
            T: 9
        },
        {
            no: 4,
            name: "port",
            kind: "scalar",
            T: 13
        },
        {
            no: 5,
            name: "transport",
            kind: "enum",
            T: proto3.getEnumType(dist_SIPTransport)
        }
    ])));
const WebhookEvent = /* @__PURE__ */ (/* unused pure expression or super */ null && (proto3.makeMessageType("livekit.WebhookEvent", ()=>[
        {
            no: 1,
            name: "event",
            kind: "scalar",
            T: 9
        },
        {
            no: 2,
            name: "room",
            kind: "message",
            T: Room
        },
        {
            no: 3,
            name: "participant",
            kind: "message",
            T: ParticipantInfo
        },
        {
            no: 9,
            name: "egress_info",
            kind: "message",
            T: dist_EgressInfo
        },
        {
            no: 10,
            name: "ingress_info",
            kind: "message",
            T: dist_IngressInfo
        },
        {
            no: 8,
            name: "track",
            kind: "message",
            T: TrackInfo
        },
        {
            no: 6,
            name: "id",
            kind: "scalar",
            T: 9
        },
        {
            no: 7,
            name: "created_at",
            kind: "scalar",
            T: 3
        },
        {
            no: 11,
            name: "num_dropped",
            kind: "scalar",
            T: 5
        }
    ])));
const version = "1.34.0";
 //# sourceMappingURL=index.mjs.map

// EXTERNAL MODULE: external "node:buffer"
var external_node_buffer_ = __webpack_require__(2254);
;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/runtime/base64url.js


function normalize(input) {
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = decoder.decode(encoded);
    }
    return encoded;
}
const encode = (input)=>external_node_buffer_.Buffer.from(input).toString("base64url");
const decodeBase64 = (input)=>new Uint8Array(Buffer.from(input, "base64"));
const encodeBase64 = (input)=>Buffer.from(input).toString("base64");

const decode = (input)=>new Uint8Array(Buffer.from(normalize(input), "base64url"));

// EXTERNAL MODULE: external "node:crypto"
var external_node_crypto_ = __webpack_require__(6005);
// EXTERNAL MODULE: external "node:util"
var external_node_util_ = __webpack_require__(7261);
;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/util/errors.js
class JOSEError extends Error {
    static{
        this.code = "ERR_JOSE_GENERIC";
    }
    constructor(message, options){
        super(message, options);
        this.code = "ERR_JOSE_GENERIC";
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class JWTClaimValidationFailed extends JOSEError {
    static{
        this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    }
    constructor(message, payload, claim = "unspecified", reason = "unspecified"){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        });
        this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
    }
}
class JWTExpired extends JOSEError {
    static{
        this.code = "ERR_JWT_EXPIRED";
    }
    constructor(message, payload, claim = "unspecified", reason = "unspecified"){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        });
        this.code = "ERR_JWT_EXPIRED";
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
    }
}
class JOSEAlgNotAllowed extends JOSEError {
    static{
        this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
    }
    constructor(...args){
        super(...args);
        this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
    }
}
class JOSENotSupported extends JOSEError {
    static{
        this.code = "ERR_JOSE_NOT_SUPPORTED";
    }
    constructor(...args){
        super(...args);
        this.code = "ERR_JOSE_NOT_SUPPORTED";
    }
}
class JWEDecryptionFailed extends JOSEError {
    static{
        this.code = "ERR_JWE_DECRYPTION_FAILED";
    }
    constructor(message = "decryption operation failed", options){
        super(message, options);
        this.code = "ERR_JWE_DECRYPTION_FAILED";
    }
}
class JWEInvalid extends JOSEError {
    static{
        this.code = "ERR_JWE_INVALID";
    }
    constructor(...args){
        super(...args);
        this.code = "ERR_JWE_INVALID";
    }
}
class JWSInvalid extends JOSEError {
    static{
        this.code = "ERR_JWS_INVALID";
    }
    constructor(...args){
        super(...args);
        this.code = "ERR_JWS_INVALID";
    }
}
class JWTInvalid extends JOSEError {
    static{
        this.code = "ERR_JWT_INVALID";
    }
    constructor(...args){
        super(...args);
        this.code = "ERR_JWT_INVALID";
    }
}
class JWKInvalid extends JOSEError {
    static{
        this.code = "ERR_JWK_INVALID";
    }
    constructor(...args){
        super(...args);
        this.code = "ERR_JWK_INVALID";
    }
}
class JWKSInvalid extends JOSEError {
    static{
        this.code = "ERR_JWKS_INVALID";
    }
    constructor(...args){
        super(...args);
        this.code = "ERR_JWKS_INVALID";
    }
}
class JWKSNoMatchingKey extends JOSEError {
    static{
        this.code = "ERR_JWKS_NO_MATCHING_KEY";
    }
    constructor(message = "no applicable key found in the JSON Web Key Set", options){
        super(message, options);
        this.code = "ERR_JWKS_NO_MATCHING_KEY";
    }
}
let prop;
class JWKSMultipleMatchingKeys extends JOSEError {
    static{
        prop = Symbol.asyncIterator;
    }
    static{
        this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    }
    constructor(message = "multiple matching keys found in the JSON Web Key Set", options){
        super(message, options);
        this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    }
}
class JWKSTimeout extends JOSEError {
    static{
        this.code = "ERR_JWKS_TIMEOUT";
    }
    constructor(message = "request timed out", options){
        super(message, options);
        this.code = "ERR_JWKS_TIMEOUT";
    }
}
class JWSSignatureVerificationFailed extends JOSEError {
    static{
        this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    }
    constructor(message = "signature verification failed", options){
        super(message, options);
        this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    }
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/runtime/dsa_digest.js

function dsaDigest(alg) {
    switch(alg){
        case "PS256":
        case "RS256":
        case "ES256":
        case "ES256K":
            return "sha256";
        case "PS384":
        case "RS384":
        case "ES384":
            return "sha384";
        case "PS512":
        case "RS512":
        case "ES512":
            return "sha512";
        case "Ed25519":
        case "EdDSA":
            return undefined;
        default:
            throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/runtime/hmac_digest.js

function hmacDigest(alg) {
    switch(alg){
        case "HS256":
            return "sha256";
        case "HS384":
            return "sha384";
        case "HS512":
            return "sha512";
        default:
            throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/runtime/webcrypto.js


const webcrypto = external_node_crypto_.webcrypto;
/* harmony default export */ const runtime_webcrypto = (webcrypto);
const isCryptoKey = (key)=>external_node_util_.types.isCryptoKey(key);

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/runtime/is_key_object.js

/* harmony default export */ const is_key_object = ((obj)=>external_node_util_.types.isKeyObject(obj));

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/lib/invalid_key_input.js
function message(msg, actual, ...types) {
    types = types.filter(Boolean);
    if (types.length > 2) {
        const last = types.pop();
        msg += `one of type ${types.join(", ")}, or ${last}.`;
    } else if (types.length === 2) {
        msg += `one of type ${types[0]} or ${types[1]}.`;
    } else {
        msg += `of type ${types[0]}.`;
    }
    if (actual == null) {
        msg += ` Received ${actual}`;
    } else if (typeof actual === "function" && actual.name) {
        msg += ` Received function ${actual.name}`;
    } else if (typeof actual === "object" && actual != null) {
        if (actual.constructor?.name) {
            msg += ` Received an instance of ${actual.constructor.name}`;
        }
    }
    return msg;
}
/* harmony default export */ const invalid_key_input = ((actual, ...types)=>{
    return message("Key must be ", actual, ...types);
});
function withAlg(alg, actual, ...types) {
    return message(`Key for the ${alg} algorithm must be `, actual, ...types);
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/runtime/is_key_like.js


/* harmony default export */ const is_key_like = ((key)=>is_key_object(key) || isCryptoKey(key));
const types = [
    "KeyObject"
];
if (globalThis.CryptoKey || runtime_webcrypto?.CryptoKey) {
    types.push("CryptoKey");
}


;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/lib/is_object.js
function isObjectLike(value) {
    return typeof value === "object" && value !== null;
}
function isObject(input) {
    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
        return false;
    }
    if (Object.getPrototypeOf(input) === null) {
        return true;
    }
    let proto = input;
    while(Object.getPrototypeOf(proto) !== null){
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/lib/is_jwk.js

function isJWK(key) {
    return isObject(key) && typeof key.kty === "string";
}
function isPrivateJWK(key) {
    return key.kty !== "oct" && typeof key.d === "string";
}
function isPublicJWK(key) {
    return key.kty !== "oct" && typeof key.d === "undefined";
}
function isSecretJWK(key) {
    return isJWK(key) && key.kty === "oct" && typeof key.k === "string";
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/runtime/get_named_curve.js







const weakMap = new WeakMap();
const namedCurveToJOSE = (namedCurve)=>{
    switch(namedCurve){
        case "prime256v1":
            return "P-256";
        case "secp384r1":
            return "P-384";
        case "secp521r1":
            return "P-521";
        case "secp256k1":
            return "secp256k1";
        default:
            throw new JOSENotSupported("Unsupported key curve for this operation");
    }
};
const getNamedCurve = (kee, raw)=>{
    let key;
    if (isCryptoKey(kee)) {
        key = external_node_crypto_.KeyObject.from(kee);
    } else if (is_key_object(kee)) {
        key = kee;
    } else if (isJWK(kee)) {
        return kee.crv;
    } else {
        throw new TypeError(invalid_key_input(kee, ...types));
    }
    if (key.type === "secret") {
        throw new TypeError('only "private" or "public" type keys can be used for this operation');
    }
    switch(key.asymmetricKeyType){
        case "ed25519":
        case "ed448":
            return `Ed${key.asymmetricKeyType.slice(2)}`;
        case "x25519":
        case "x448":
            return `X${key.asymmetricKeyType.slice(1)}`;
        case "ec":
            {
                const namedCurve = key.asymmetricKeyDetails.namedCurve;
                if (raw) {
                    return namedCurve;
                }
                return namedCurveToJOSE(namedCurve);
            }
        default:
            throw new TypeError("Invalid asymmetric key type for this operation");
    }
};
/* harmony default export */ const get_named_curve = (getNamedCurve);

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/runtime/check_key_length.js

/* harmony default export */ const check_key_length = ((key, alg)=>{
    let modulusLength;
    try {
        if (key instanceof external_node_crypto_.KeyObject) {
            modulusLength = key.asymmetricKeyDetails?.modulusLength;
        } else {
            modulusLength = Buffer.from(key.n, "base64url").byteLength << 3;
        }
    } catch  {}
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
        throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
});

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/runtime/node_key.js




const ecCurveAlgMap = new Map([
    [
        "ES256",
        "P-256"
    ],
    [
        "ES256K",
        "secp256k1"
    ],
    [
        "ES384",
        "P-384"
    ],
    [
        "ES512",
        "P-521"
    ]
]);
function keyForCrypto(alg, key) {
    let asymmetricKeyType;
    let asymmetricKeyDetails;
    let isJWK;
    if (key instanceof external_node_crypto_.KeyObject) {
        asymmetricKeyType = key.asymmetricKeyType;
        asymmetricKeyDetails = key.asymmetricKeyDetails;
    } else {
        isJWK = true;
        switch(key.kty){
            case "RSA":
                asymmetricKeyType = "rsa";
                break;
            case "EC":
                asymmetricKeyType = "ec";
                break;
            case "OKP":
                {
                    if (key.crv === "Ed25519") {
                        asymmetricKeyType = "ed25519";
                        break;
                    }
                    if (key.crv === "Ed448") {
                        asymmetricKeyType = "ed448";
                        break;
                    }
                    throw new TypeError("Invalid key for this operation, its crv must be Ed25519 or Ed448");
                }
            default:
                throw new TypeError("Invalid key for this operation, its kty must be RSA, OKP, or EC");
        }
    }
    let options;
    switch(alg){
        case "Ed25519":
            if (asymmetricKeyType !== "ed25519") {
                throw new TypeError(`Invalid key for this operation, its asymmetricKeyType must be ed25519`);
            }
            break;
        case "EdDSA":
            if (![
                "ed25519",
                "ed448"
            ].includes(asymmetricKeyType)) {
                throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be ed25519 or ed448");
            }
            break;
        case "RS256":
        case "RS384":
        case "RS512":
            if (asymmetricKeyType !== "rsa") {
                throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa");
            }
            check_key_length(key, alg);
            break;
        case "PS256":
        case "PS384":
        case "PS512":
            if (asymmetricKeyType === "rsa-pss") {
                const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = asymmetricKeyDetails;
                const length = parseInt(alg.slice(-3), 10);
                if (hashAlgorithm !== undefined && (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm)) {
                    throw new TypeError(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${alg}`);
                }
                if (saltLength !== undefined && saltLength > length >> 3) {
                    throw new TypeError(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${alg}`);
                }
            } else if (asymmetricKeyType !== "rsa") {
                throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa or rsa-pss");
            }
            check_key_length(key, alg);
            options = {
                padding: external_node_crypto_.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: external_node_crypto_.constants.RSA_PSS_SALTLEN_DIGEST
            };
            break;
        case "ES256":
        case "ES256K":
        case "ES384":
        case "ES512":
            {
                if (asymmetricKeyType !== "ec") {
                    throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be ec");
                }
                const actual = get_named_curve(key);
                const expected = ecCurveAlgMap.get(alg);
                if (actual !== expected) {
                    throw new TypeError(`Invalid key curve for the algorithm, its curve must be ${expected}, got ${actual}`);
                }
                options = {
                    dsaEncoding: "ieee-p1363"
                };
                break;
            }
        default:
            throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    if (isJWK) {
        return {
            format: "jwk",
            key,
            ...options
        };
    }
    return options ? {
        ...options,
        key
    } : key;
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/lib/crypto_key.js
function unusable(name, prop = "algorithm.name") {
    return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
}
function isAlgorithm(algorithm, name) {
    return algorithm.name === name;
}
function getHashLength(hash) {
    return parseInt(hash.name.slice(4), 10);
}
function crypto_key_getNamedCurve(alg) {
    switch(alg){
        case "ES256":
            return "P-256";
        case "ES384":
            return "P-384";
        case "ES512":
            return "P-521";
        default:
            throw new Error("unreachable");
    }
}
function checkUsage(key, usages) {
    if (usages.length && !usages.some((expected)=>key.usages.includes(expected))) {
        let msg = "CryptoKey does not support this operation, its usages must include ";
        if (usages.length > 2) {
            const last = usages.pop();
            msg += `one of ${usages.join(", ")}, or ${last}.`;
        } else if (usages.length === 2) {
            msg += `one of ${usages[0]} or ${usages[1]}.`;
        } else {
            msg += `${usages[0]}.`;
        }
        throw new TypeError(msg);
    }
}
function checkSigCryptoKey(key, alg, ...usages) {
    switch(alg){
        case "HS256":
        case "HS384":
        case "HS512":
            {
                if (!isAlgorithm(key.algorithm, "HMAC")) throw unusable("HMAC");
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        case "RS256":
        case "RS384":
        case "RS512":
            {
                if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5")) throw unusable("RSASSA-PKCS1-v1_5");
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        case "PS256":
        case "PS384":
        case "PS512":
            {
                if (!isAlgorithm(key.algorithm, "RSA-PSS")) throw unusable("RSA-PSS");
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        case "EdDSA":
            {
                if (key.algorithm.name !== "Ed25519" && key.algorithm.name !== "Ed448") {
                    throw unusable("Ed25519 or Ed448");
                }
                break;
            }
        case "Ed25519":
            {
                if (!isAlgorithm(key.algorithm, "Ed25519")) throw unusable("Ed25519");
                break;
            }
        case "ES256":
        case "ES384":
        case "ES512":
            {
                if (!isAlgorithm(key.algorithm, "ECDSA")) throw unusable("ECDSA");
                const expected = crypto_key_getNamedCurve(alg);
                const actual = key.algorithm.namedCurve;
                if (actual !== expected) throw unusable(expected, "algorithm.namedCurve");
                break;
            }
        default:
            throw new TypeError("CryptoKey does not support this operation");
    }
    checkUsage(key, usages);
}
function checkEncCryptoKey(key, alg, ...usages) {
    switch(alg){
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
            {
                if (!isAlgorithm(key.algorithm, "AES-GCM")) throw unusable("AES-GCM");
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, "algorithm.length");
                break;
            }
        case "A128KW":
        case "A192KW":
        case "A256KW":
            {
                if (!isAlgorithm(key.algorithm, "AES-KW")) throw unusable("AES-KW");
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, "algorithm.length");
                break;
            }
        case "ECDH":
            {
                switch(key.algorithm.name){
                    case "ECDH":
                    case "X25519":
                    case "X448":
                        break;
                    default:
                        throw unusable("ECDH, X25519, or X448");
                }
                break;
            }
        case "PBES2-HS256+A128KW":
        case "PBES2-HS384+A192KW":
        case "PBES2-HS512+A256KW":
            if (!isAlgorithm(key.algorithm, "PBKDF2")) throw unusable("PBKDF2");
            break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
            {
                if (!isAlgorithm(key.algorithm, "RSA-OAEP")) throw unusable("RSA-OAEP");
                const expected = parseInt(alg.slice(9), 10) || 1;
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        default:
            throw new TypeError("CryptoKey does not support this operation");
    }
    checkUsage(key, usages);
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/runtime/get_sign_verify_key.js






function getSignVerifyKey(alg, key, usage) {
    if (key instanceof Uint8Array) {
        if (!alg.startsWith("HS")) {
            throw new TypeError(invalid_key_input(key, ...types));
        }
        return (0,external_node_crypto_.createSecretKey)(key);
    }
    if (key instanceof external_node_crypto_.KeyObject) {
        return key;
    }
    if (isCryptoKey(key)) {
        checkSigCryptoKey(key, alg, usage);
        return external_node_crypto_.KeyObject.from(key);
    }
    if (isJWK(key)) {
        if (alg.startsWith("HS")) {
            return (0,external_node_crypto_.createSecretKey)(Buffer.from(key.k, "base64url"));
        }
        return key;
    }
    throw new TypeError(invalid_key_input(key, ...types, "Uint8Array", "JSON Web Key"));
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/runtime/sign.js






const oneShotSign = (0,external_node_util_.promisify)(external_node_crypto_.sign);
const sign = async (alg, key, data)=>{
    const k = getSignVerifyKey(alg, key, "sign");
    if (alg.startsWith("HS")) {
        const hmac = external_node_crypto_.createHmac(hmacDigest(alg), k);
        hmac.update(data);
        return hmac.digest();
    }
    return oneShotSign(dsaDigest(alg), data, keyForCrypto(alg, k));
};
/* harmony default export */ const runtime_sign = (sign);

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/lib/is_disjoint.js
const isDisjoint = (...headers)=>{
    const sources = headers.filter(Boolean);
    if (sources.length === 0 || sources.length === 1) {
        return true;
    }
    let acc;
    for (const header of sources){
        const parameters = Object.keys(header);
        if (!acc || acc.size === 0) {
            acc = new Set(parameters);
            continue;
        }
        for (const parameter of parameters){
            if (acc.has(parameter)) {
                return false;
            }
            acc.add(parameter);
        }
    }
    return true;
};
/* harmony default export */ const is_disjoint = (isDisjoint);

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/lib/buffer_utils.js

const encoder = new TextEncoder();
const buffer_utils_decoder = new TextDecoder();
const MAX_INT32 = (/* unused pure expression or super */ null && (2 ** 32));
function concat(...buffers) {
    const size = buffers.reduce((acc, { length })=>acc + length, 0);
    const buf = new Uint8Array(size);
    let i = 0;
    for (const buffer of buffers){
        buf.set(buffer, i);
        i += buffer.length;
    }
    return buf;
}
function p2s(alg, p2sInput) {
    return concat(encoder.encode(alg), new Uint8Array([
        0
    ]), p2sInput);
}
function writeUInt32BE(buf, value, offset) {
    if (value < 0 || value >= MAX_INT32) {
        throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
    }
    buf.set([
        value >>> 24,
        value >>> 16,
        value >>> 8,
        value & 0xff
    ], offset);
}
function uint64be(value) {
    const high = Math.floor(value / MAX_INT32);
    const low = value % MAX_INT32;
    const buf = new Uint8Array(8);
    writeUInt32BE(buf, high, 0);
    writeUInt32BE(buf, low, 4);
    return buf;
}
function uint32be(value) {
    const buf = new Uint8Array(4);
    writeUInt32BE(buf, value);
    return buf;
}
function lengthAndInput(input) {
    return concat(uint32be(input.length), input);
}
async function concatKdf(secret, bits, value) {
    const iterations = Math.ceil((bits >> 3) / 32);
    const res = new Uint8Array(iterations * 32);
    for(let iter = 0; iter < iterations; iter++){
        const buf = new Uint8Array(4 + secret.length + value.length);
        buf.set(uint32be(iter + 1));
        buf.set(secret, 4);
        buf.set(value, 4 + secret.length);
        res.set(await digest("sha256", buf), iter * 32);
    }
    return res.slice(0, bits >> 3);
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/lib/check_key_type.js



const tag = (key)=>key?.[Symbol.toStringTag];
const jwkMatchesOp = (alg, key, usage)=>{
    if (key.use !== undefined && key.use !== "sig") {
        throw new TypeError("Invalid key for this operation, when present its use must be sig");
    }
    if (key.key_ops !== undefined && key.key_ops.includes?.(usage) !== true) {
        throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${usage}`);
    }
    if (key.alg !== undefined && key.alg !== alg) {
        throw new TypeError(`Invalid key for this operation, when present its alg must be ${alg}`);
    }
    return true;
};
const symmetricTypeCheck = (alg, key, usage, allowJwk)=>{
    if (key instanceof Uint8Array) return;
    if (allowJwk && isJWK(key)) {
        if (isSecretJWK(key) && jwkMatchesOp(alg, key, usage)) return;
        throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
    }
    if (!is_key_like(key)) {
        throw new TypeError(withAlg(alg, key, ...types, "Uint8Array", allowJwk ? "JSON Web Key" : null));
    }
    if (key.type !== "secret") {
        throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
    }
};
const asymmetricTypeCheck = (alg, key, usage, allowJwk)=>{
    if (allowJwk && isJWK(key)) {
        switch(usage){
            case "sign":
                if (isPrivateJWK(key) && jwkMatchesOp(alg, key, usage)) return;
                throw new TypeError(`JSON Web Key for this operation be a private JWK`);
            case "verify":
                if (isPublicJWK(key) && jwkMatchesOp(alg, key, usage)) return;
                throw new TypeError(`JSON Web Key for this operation be a public JWK`);
        }
    }
    if (!is_key_like(key)) {
        throw new TypeError(withAlg(alg, key, ...types, allowJwk ? "JSON Web Key" : null));
    }
    if (key.type === "secret") {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
    }
    if (usage === "sign" && key.type === "public") {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
    }
    if (usage === "decrypt" && key.type === "public") {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
    }
    if (key.algorithm && usage === "verify" && key.type === "private") {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
    }
    if (key.algorithm && usage === "encrypt" && key.type === "private") {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
    }
};
function checkKeyType(allowJwk, alg, key, usage) {
    const symmetric = alg.startsWith("HS") || alg === "dir" || alg.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(alg);
    if (symmetric) {
        symmetricTypeCheck(alg, key, usage, allowJwk);
    } else {
        asymmetricTypeCheck(alg, key, usage, allowJwk);
    }
}
/* harmony default export */ const check_key_type = (checkKeyType.bind(undefined, false));
const checkKeyTypeWithJwk = checkKeyType.bind(undefined, true);

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/lib/validate_crit.js

function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
    if (joseHeader.crit !== undefined && protectedHeader?.crit === undefined) {
        throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
    }
    if (!protectedHeader || protectedHeader.crit === undefined) {
        return new Set();
    }
    if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input)=>typeof input !== "string" || input.length === 0)) {
        throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    }
    let recognized;
    if (recognizedOption !== undefined) {
        recognized = new Map([
            ...Object.entries(recognizedOption),
            ...recognizedDefault.entries()
        ]);
    } else {
        recognized = recognizedDefault;
    }
    for (const parameter of protectedHeader.crit){
        if (!recognized.has(parameter)) {
            throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
        }
        if (joseHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" is missing`);
        }
        if (recognized.get(parameter) && protectedHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
        }
    }
    return new Set(protectedHeader.crit);
}
/* harmony default export */ const validate_crit = (validateCrit);

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/jws/flattened/sign.js







class FlattenedSign {
    constructor(payload){
        if (!(payload instanceof Uint8Array)) {
            throw new TypeError("payload must be an instance of Uint8Array");
        }
        this._payload = payload;
    }
    setProtectedHeader(protectedHeader) {
        if (this._protectedHeader) {
            throw new TypeError("setProtectedHeader can only be called once");
        }
        this._protectedHeader = protectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        if (this._unprotectedHeader) {
            throw new TypeError("setUnprotectedHeader can only be called once");
        }
        this._unprotectedHeader = unprotectedHeader;
        return this;
    }
    async sign(key, options) {
        if (!this._protectedHeader && !this._unprotectedHeader) {
            throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
        }
        if (!is_disjoint(this._protectedHeader, this._unprotectedHeader)) {
            throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
        }
        const joseHeader = {
            ...this._protectedHeader,
            ...this._unprotectedHeader
        };
        const extensions = validate_crit(JWSInvalid, new Map([
            [
                "b64",
                true
            ]
        ]), options?.crit, this._protectedHeader, joseHeader);
        let b64 = true;
        if (extensions.has("b64")) {
            b64 = this._protectedHeader.b64;
            if (typeof b64 !== "boolean") {
                throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
            }
        }
        const { alg } = joseHeader;
        if (typeof alg !== "string" || !alg) {
            throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        }
        checkKeyTypeWithJwk(alg, key, "sign");
        let payload = this._payload;
        if (b64) {
            payload = encoder.encode(encode(payload));
        }
        let protectedHeader;
        if (this._protectedHeader) {
            protectedHeader = encoder.encode(encode(JSON.stringify(this._protectedHeader)));
        } else {
            protectedHeader = encoder.encode("");
        }
        const data = concat(protectedHeader, encoder.encode("."), payload);
        const signature = await runtime_sign(alg, key, data);
        const jws = {
            signature: encode(signature),
            payload: ""
        };
        if (b64) {
            jws.payload = buffer_utils_decoder.decode(payload);
        }
        if (this._unprotectedHeader) {
            jws.header = this._unprotectedHeader;
        }
        if (this._protectedHeader) {
            jws.protected = buffer_utils_decoder.decode(protectedHeader);
        }
        return jws;
    }
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/jws/compact/sign.js

class CompactSign {
    constructor(payload){
        this._flattened = new FlattenedSign(payload);
    }
    setProtectedHeader(protectedHeader) {
        this._flattened.setProtectedHeader(protectedHeader);
        return this;
    }
    async sign(key, options) {
        const jws = await this._flattened.sign(key, options);
        if (jws.payload === undefined) {
            throw new TypeError("use the flattened module for creating JWS with b64: false");
        }
        return `${jws.protected}.${jws.payload}.${jws.signature}`;
    }
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/lib/epoch.js
/* harmony default export */ const epoch = ((date)=>Math.floor(date.getTime() / 1000));

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/lib/secs.js
const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const year = day * 365.25;
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
/* harmony default export */ const secs = ((str)=>{
    const matched = REGEX.exec(str);
    if (!matched || matched[4] && matched[1]) {
        throw new TypeError("Invalid time period format");
    }
    const value = parseFloat(matched[2]);
    const unit = matched[3].toLowerCase();
    let numericDate;
    switch(unit){
        case "sec":
        case "secs":
        case "second":
        case "seconds":
        case "s":
            numericDate = Math.round(value);
            break;
        case "minute":
        case "minutes":
        case "min":
        case "mins":
        case "m":
            numericDate = Math.round(value * minute);
            break;
        case "hour":
        case "hours":
        case "hr":
        case "hrs":
        case "h":
            numericDate = Math.round(value * hour);
            break;
        case "day":
        case "days":
        case "d":
            numericDate = Math.round(value * day);
            break;
        case "week":
        case "weeks":
        case "w":
            numericDate = Math.round(value * week);
            break;
        default:
            numericDate = Math.round(value * year);
            break;
    }
    if (matched[1] === "-" || matched[4] === "ago") {
        return -numericDate;
    }
    return numericDate;
});

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/jwt/produce.js



function validateInput(label, input) {
    if (!Number.isFinite(input)) {
        throw new TypeError(`Invalid ${label} input`);
    }
    return input;
}
class ProduceJWT {
    constructor(payload = {}){
        if (!isObject(payload)) {
            throw new TypeError("JWT Claims Set MUST be an object");
        }
        this._payload = payload;
    }
    setIssuer(issuer) {
        this._payload = {
            ...this._payload,
            iss: issuer
        };
        return this;
    }
    setSubject(subject) {
        this._payload = {
            ...this._payload,
            sub: subject
        };
        return this;
    }
    setAudience(audience) {
        this._payload = {
            ...this._payload,
            aud: audience
        };
        return this;
    }
    setJti(jwtId) {
        this._payload = {
            ...this._payload,
            jti: jwtId
        };
        return this;
    }
    setNotBefore(input) {
        if (typeof input === "number") {
            this._payload = {
                ...this._payload,
                nbf: validateInput("setNotBefore", input)
            };
        } else if (input instanceof Date) {
            this._payload = {
                ...this._payload,
                nbf: validateInput("setNotBefore", epoch(input))
            };
        } else {
            this._payload = {
                ...this._payload,
                nbf: epoch(new Date()) + secs(input)
            };
        }
        return this;
    }
    setExpirationTime(input) {
        if (typeof input === "number") {
            this._payload = {
                ...this._payload,
                exp: validateInput("setExpirationTime", input)
            };
        } else if (input instanceof Date) {
            this._payload = {
                ...this._payload,
                exp: validateInput("setExpirationTime", epoch(input))
            };
        } else {
            this._payload = {
                ...this._payload,
                exp: epoch(new Date()) + secs(input)
            };
        }
        return this;
    }
    setIssuedAt(input) {
        if (typeof input === "undefined") {
            this._payload = {
                ...this._payload,
                iat: epoch(new Date())
            };
        } else if (input instanceof Date) {
            this._payload = {
                ...this._payload,
                iat: validateInput("setIssuedAt", epoch(input))
            };
        } else if (typeof input === "string") {
            this._payload = {
                ...this._payload,
                iat: validateInput("setIssuedAt", epoch(new Date()) + secs(input))
            };
        } else {
            this._payload = {
                ...this._payload,
                iat: validateInput("setIssuedAt", input)
            };
        }
        return this;
    }
}

;// CONCATENATED MODULE: ./node_modules/jose/dist/node/esm/jwt/sign.js




class SignJWT extends ProduceJWT {
    setProtectedHeader(protectedHeader) {
        this._protectedHeader = protectedHeader;
        return this;
    }
    async sign(key, options) {
        const sig = new CompactSign(encoder.encode(JSON.stringify(this._payload)));
        sig.setProtectedHeader(this._protectedHeader);
        if (Array.isArray(this._protectedHeader?.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === false) {
            throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
        }
        return sig.sign(key, options);
    }
}

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/grants.js

function trackSourceToString(source) {
    switch(source){
        case TrackSource.CAMERA:
            return "camera";
        case TrackSource.MICROPHONE:
            return "microphone";
        case TrackSource.SCREEN_SHARE:
            return "screen_share";
        case TrackSource.SCREEN_SHARE_AUDIO:
            return "screen_share_audio";
        default:
            throw new TypeError(`Cannot convert TrackSource ${source} to string`);
    }
}
function claimsToJwtPayload(grant) {
    var _a;
    const claim = {
        ...grant
    };
    if (Array.isArray((_a = claim.video) == null ? void 0 : _a.canPublishSources)) {
        claim.video.canPublishSources = claim.video.canPublishSources.map(trackSourceToString);
    }
    return claim;
}
 //# sourceMappingURL=grants.js.map

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/AccessToken.js


const defaultTTL = `6h`;
class AccessToken {
    /**
   * Creates a new AccessToken
   * @param apiKey - API Key, can be set in env LIVEKIT_API_KEY
   * @param apiSecret - Secret, can be set in env LIVEKIT_API_SECRET
   */ constructor(apiKey, apiSecret, options){
        if (!apiKey) {
            apiKey = process.env.LIVEKIT_API_KEY;
        }
        if (!apiSecret) {
            apiSecret = process.env.LIVEKIT_API_SECRET;
        }
        if (!apiKey || !apiSecret) {
            throw Error("api-key and api-secret must be set");
        } else if (typeof document !== "undefined") {
            console.error("You should not include your API secret in your web client bundle.\n\nYour web client should request a token from your backend server which should then use the API secret to generate a token. See https://docs.livekit.io/client/connect/");
        }
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.grants = {};
        this.identity = options == null ? void 0 : options.identity;
        this.ttl = (options == null ? void 0 : options.ttl) || defaultTTL;
        if (typeof this.ttl === "number") {
            this.ttl = `${this.ttl}s`;
        }
        if (options == null ? void 0 : options.metadata) {
            this.metadata = options.metadata;
        }
        if (options == null ? void 0 : options.attributes) {
            this.attributes = options.attributes;
        }
        if (options == null ? void 0 : options.name) {
            this.name = options.name;
        }
    }
    /**
   * Adds a video grant to this token.
   * @param grant -
   */ addGrant(grant) {
        this.grants.video = {
            ...this.grants.video ?? {},
            ...grant
        };
    }
    /**
   * Adds a SIP grant to this token.
   * @param grant -
   */ addSIPGrant(grant) {
        this.grants.sip = {
            ...this.grants.sip ?? {},
            ...grant
        };
    }
    get name() {
        return this.grants.name;
    }
    set name(name) {
        this.grants.name = name;
    }
    get metadata() {
        return this.grants.metadata;
    }
    /**
   * Set metadata to be passed to the Participant, used only when joining the room
   */ set metadata(md) {
        this.grants.metadata = md;
    }
    get attributes() {
        return this.grants.attributes;
    }
    set attributes(attrs) {
        this.grants.attributes = attrs;
    }
    get kind() {
        return this.grants.kind;
    }
    set kind(kind) {
        this.grants.kind = kind;
    }
    get sha256() {
        return this.grants.sha256;
    }
    set sha256(sha) {
        this.grants.sha256 = sha;
    }
    get roomPreset() {
        return this.grants.roomPreset;
    }
    set roomPreset(preset) {
        this.grants.roomPreset = preset;
    }
    get roomConfig() {
        return this.grants.roomConfig;
    }
    set roomConfig(config) {
        this.grants.roomConfig = config;
    }
    /**
   * @returns JWT encoded token
   */ async toJwt() {
        var _a;
        const secret = new TextEncoder().encode(this.apiSecret);
        const jwt = new SignJWT(claimsToJwtPayload(this.grants)).setProtectedHeader({
            alg: "HS256"
        }).setIssuer(this.apiKey).setExpirationTime(this.ttl).setNotBefore(0);
        if (this.identity) {
            jwt.setSubject(this.identity);
        } else if ((_a = this.grants.video) == null ? void 0 : _a.roomJoin) {
            throw Error("identity is required for join but not set");
        }
        return jwt.sign(secret);
    }
}
class AccessToken_TokenVerifier {
    constructor(apiKey, apiSecret){
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }
    async verify(token) {
        const secret = new TextEncoder().encode(this.apiSecret);
        const { payload } = await jose.jwtVerify(token, secret, {
            issuer: this.apiKey
        });
        if (!payload) {
            throw Error("invalid token");
        }
        return payload;
    }
}
 //# sourceMappingURL=AccessToken.js.map

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/ServiceBase.js

class ServiceBase_ServiceBase {
    /**
   * @param apiKey - API Key.
   * @param secret - API Secret.
   * @param ttl - token TTL
   */ constructor(apiKey, secret, ttl){
        this.apiKey = apiKey;
        this.secret = secret;
        this.ttl = ttl || "10m";
    }
    async authHeader(grant, sip) {
        const at = new AccessToken(this.apiKey, this.secret, {
            ttl: this.ttl
        });
        if (grant) {
            at.addGrant(grant);
        }
        if (sip) {
            at.addSIPGrant(sip);
        }
        return {
            Authorization: `Bearer ${await at.toJwt()}`
        };
    }
}
 //# sourceMappingURL=ServiceBase.js.map

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/AgentDispatchClient.js



const svc = "AgentDispatchService";
class AgentDispatchClient extends (/* unused pure expression or super */ null && (ServiceBase)) {
    /**
   * @param host - hostname including protocol. i.e. 'https://<project>.livekit.cloud'
   * @param apiKey - API Key, can be set in env var LIVEKIT_API_KEY
   * @param secret - API Secret, can be set in env var LIVEKIT_API_SECRET
   */ constructor(host, apiKey, secret){
        super(apiKey, secret);
        this.rpc = new TwirpRpc(host, livekitPackage);
    }
    /**
   * Create an explicit dispatch for an agent to join a room. To use explicit
   * dispatch, your agent must be registered with an `agentName`.
   * @param roomName - name of the room to dispatch to
   * @param agentName - name of the agent to dispatch
   * @param options - optional metadata to send along with the dispatch
   * @returns the dispatch that was created
   */ async createDispatch(roomName, agentName, options) {
        const req = new CreateAgentDispatchRequest({
            room: roomName,
            agentName,
            metadata: options == null ? void 0 : options.metadata
        }).toJson();
        const data = await this.rpc.request(svc, "CreateDispatch", req, await this.authHeader({
            roomAdmin: true,
            room: roomName
        }));
        return AgentDispatch.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * Delete an explicit dispatch for an agent in a room.
   * @param dispatchId - id of the dispatch to delete
   * @param roomName - name of the room the dispatch is for
   */ async deleteDispatch(dispatchId, roomName) {
        const req = new DeleteAgentDispatchRequest({
            dispatchId,
            room: roomName
        }).toJson();
        await this.rpc.request(svc, "DeleteDispatch", req, await this.authHeader({
            roomAdmin: true,
            room: roomName
        }));
    }
    /**
   * Get an Agent dispatch by ID
   * @param dispatchId - id of the dispatch to get
   * @param roomName - name of the room the dispatch is for
   * @returns the dispatch that was found, or undefined if not found
   */ async getDispatch(dispatchId, roomName) {
        const req = new ListAgentDispatchRequest({
            dispatchId,
            room: roomName
        }).toJson();
        const data = await this.rpc.request(svc, "ListDispatch", req, await this.authHeader({
            roomAdmin: true,
            room: roomName
        }));
        const res = ListAgentDispatchResponse.fromJson(data, {
            ignoreUnknownFields: true
        });
        if (res.agentDispatches.length === 0) {
            return void 0;
        }
        return res.agentDispatches[0];
    }
    /**
   * List all agent dispatches for a room
   * @param roomName - name of the room to list dispatches for
   * @returns the list of dispatches
   */ async listDispatch(roomName) {
        const req = new ListAgentDispatchRequest({
            room: roomName
        }).toJson();
        const data = await this.rpc.request(svc, "ListDispatch", req, await this.authHeader({
            roomAdmin: true,
            room: roomName
        }));
        const res = ListAgentDispatchResponse.fromJson(data, {
            ignoreUnknownFields: true
        });
        return res.agentDispatches;
    }
}
 //# sourceMappingURL=AgentDispatchClient.js.map

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/EgressClient.js



const EgressClient_svc = "Egress";
class EgressClient extends (/* unused pure expression or super */ null && (ServiceBase)) {
    /**
   * @param host - hostname including protocol. i.e. 'https://<project>.livekit.cloud'
   * @param apiKey - API Key, can be set in env var LIVEKIT_API_KEY
   * @param secret - API Secret, can be set in env var LIVEKIT_API_SECRET
   */ constructor(host, apiKey, secret){
        super(apiKey, secret);
        this.rpc = new TwirpRpc(host, livekitPackage);
    }
    async startRoomCompositeEgress(roomName, output, optsOrLayout, options, audioOnly, videoOnly, customBaseUrl) {
        let layout;
        if (optsOrLayout !== void 0) {
            if (typeof optsOrLayout === "string") {
                layout = optsOrLayout;
            } else {
                const opts = optsOrLayout;
                layout = opts.layout;
                options = opts.encodingOptions;
                audioOnly = opts.audioOnly;
                videoOnly = opts.videoOnly;
                customBaseUrl = opts.customBaseUrl;
            }
        }
        layout ??= "";
        audioOnly ??= false;
        videoOnly ??= false;
        customBaseUrl ??= "";
        const { output: legacyOutput, options: egressOptions, fileOutputs, streamOutputs, segmentOutputs, imageOutputs } = this.getOutputParams(output, options);
        const req = new RoomCompositeEgressRequest({
            roomName,
            layout,
            audioOnly,
            videoOnly,
            customBaseUrl,
            output: legacyOutput,
            options: egressOptions,
            fileOutputs,
            streamOutputs,
            segmentOutputs,
            imageOutputs
        }).toJson();
        const data = await this.rpc.request(EgressClient_svc, "StartRoomCompositeEgress", req, await this.authHeader({
            roomRecord: true
        }));
        return EgressInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @param url - url
   * @param output - file or stream output
   * @param opts - WebOptions
   */ async startWebEgress(url, output, opts) {
        const audioOnly = (opts == null ? void 0 : opts.audioOnly) || false;
        const videoOnly = (opts == null ? void 0 : opts.videoOnly) || false;
        const awaitStartSignal = (opts == null ? void 0 : opts.awaitStartSignal) || false;
        const { output: legacyOutput, options, fileOutputs, streamOutputs, segmentOutputs, imageOutputs } = this.getOutputParams(output, opts == null ? void 0 : opts.encodingOptions);
        const req = new WebEgressRequest({
            url,
            audioOnly,
            videoOnly,
            awaitStartSignal,
            output: legacyOutput,
            options,
            fileOutputs,
            streamOutputs,
            segmentOutputs,
            imageOutputs
        }).toJson();
        const data = await this.rpc.request(EgressClient_svc, "StartWebEgress", req, await this.authHeader({
            roomRecord: true
        }));
        return EgressInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * Export a participant's audio and video tracks,
   *
   * @param roomName - room name
   * @param output - one or more outputs
   * @param opts - ParticipantEgressOptions
   */ async startParticipantEgress(roomName, identity, output, opts) {
        const { options, fileOutputs, streamOutputs, segmentOutputs, imageOutputs } = this.getOutputParams(output, opts == null ? void 0 : opts.encodingOptions);
        const req = new ParticipantEgressRequest({
            roomName,
            identity,
            screenShare: (opts == null ? void 0 : opts.screenShare) ?? false,
            options,
            fileOutputs,
            streamOutputs,
            segmentOutputs,
            imageOutputs
        }).toJson();
        const data = await this.rpc.request(EgressClient_svc, "StartParticipantEgress", req, await this.authHeader({
            roomRecord: true
        }));
        return EgressInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    async startTrackCompositeEgress(roomName, output, optsOrAudioTrackId, videoTrackId, options) {
        let audioTrackId;
        if (optsOrAudioTrackId !== void 0) {
            if (typeof optsOrAudioTrackId === "string") {
                audioTrackId = optsOrAudioTrackId;
            } else {
                const opts = optsOrAudioTrackId;
                audioTrackId = opts.audioTrackId;
                videoTrackId = opts.videoTrackId;
                options = opts.encodingOptions;
            }
        }
        audioTrackId ??= "";
        videoTrackId ??= "";
        const { output: legacyOutput, options: egressOptions, fileOutputs, streamOutputs, segmentOutputs, imageOutputs } = this.getOutputParams(output, options);
        const req = new TrackCompositeEgressRequest({
            roomName,
            audioTrackId,
            videoTrackId,
            output: legacyOutput,
            options: egressOptions,
            fileOutputs,
            streamOutputs,
            segmentOutputs,
            imageOutputs
        }).toJson();
        const data = await this.rpc.request(EgressClient_svc, "StartTrackCompositeEgress", req, await this.authHeader({
            roomRecord: true
        }));
        return EgressInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isEncodedOutputs(output) {
        return output.file !== void 0 || output.stream !== void 0 || output.segments !== void 0 || output.images !== void 0;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isEncodedFileOutput(output) {
        return output.filepath !== void 0 || output.fileType !== void 0;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isSegmentedFileOutput(output) {
        return output.filenamePrefix !== void 0 || output.playlistName !== void 0 || output.filenameSuffix !== void 0;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isStreamOutput(output) {
        return output.protocol !== void 0 || output.urls !== void 0;
    }
    getOutputParams(output, opts) {
        let file;
        let fileOutputs;
        let stream;
        let streamOutputs;
        let segments;
        let segmentOutputs;
        let imageOutputs;
        if (this.isEncodedOutputs(output)) {
            if (output.file !== void 0) {
                fileOutputs = [
                    output.file
                ];
            }
            if (output.stream !== void 0) {
                streamOutputs = [
                    output.stream
                ];
            }
            if (output.segments !== void 0) {
                segmentOutputs = [
                    output.segments
                ];
            }
            if (output.images !== void 0) {
                imageOutputs = [
                    output.images
                ];
            }
        } else if (this.isEncodedFileOutput(output)) {
            file = output;
            fileOutputs = [
                file
            ];
        } else if (this.isSegmentedFileOutput(output)) {
            segments = output;
            segmentOutputs = [
                segments
            ];
        } else if (this.isStreamOutput(output)) {
            stream = output;
            streamOutputs = [
                stream
            ];
        }
        let legacyOutput;
        if (file) {
            legacyOutput = {
                case: "file",
                value: file
            };
        } else if (stream) {
            legacyOutput = {
                case: "stream",
                value: stream
            };
        } else if (segments) {
            legacyOutput = {
                case: "segments",
                value: segments
            };
        }
        let egressOptions;
        if (opts) {
            if (typeof opts === "number") {
                egressOptions = {
                    case: "preset",
                    value: opts
                };
            } else {
                egressOptions = {
                    case: "advanced",
                    value: opts
                };
            }
        }
        return {
            output: legacyOutput,
            options: egressOptions,
            fileOutputs,
            streamOutputs,
            segmentOutputs,
            imageOutputs
        };
    }
    /**
   * @param roomName - room name
   * @param output - file or websocket output
   * @param trackId - track Id
   */ async startTrackEgress(roomName, output, trackId) {
        let legacyOutput;
        if (typeof output === "string") {
            legacyOutput = {
                case: "websocketUrl",
                value: output
            };
        } else {
            legacyOutput = {
                case: "file",
                value: output
            };
        }
        const req = new TrackEgressRequest({
            roomName,
            trackId,
            output: legacyOutput
        }).toJson();
        const data = await this.rpc.request(EgressClient_svc, "StartTrackEgress", req, await this.authHeader({
            roomRecord: true
        }));
        return EgressInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @param egressId -
   * @param layout -
   */ async updateLayout(egressId, layout) {
        const data = await this.rpc.request(EgressClient_svc, "UpdateLayout", new UpdateLayoutRequest({
            egressId,
            layout
        }).toJson(), await this.authHeader({
            roomRecord: true
        }));
        return EgressInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @param egressId -
   * @param addOutputUrls -
   * @param removeOutputUrls -
   */ async updateStream(egressId, addOutputUrls, removeOutputUrls) {
        addOutputUrls ??= [];
        removeOutputUrls ??= [];
        const data = await this.rpc.request(EgressClient_svc, "UpdateStream", new UpdateStreamRequest({
            egressId,
            addOutputUrls,
            removeOutputUrls
        }).toJson(), await this.authHeader({
            roomRecord: true
        }));
        return EgressInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @param roomName - list egress for one room only
   */ async listEgress(options) {
        let req = {};
        if (typeof options === "string") {
            req.roomName = options;
        } else if (options !== void 0) {
            req = options;
        }
        const data = await this.rpc.request(EgressClient_svc, "ListEgress", new ListEgressRequest(req).toJson(), await this.authHeader({
            roomRecord: true
        }));
        return ListEgressResponse.fromJson(data, {
            ignoreUnknownFields: true
        }).items ?? [];
    }
    /**
   * @param egressId -
   */ async stopEgress(egressId) {
        const data = await this.rpc.request(EgressClient_svc, "StopEgress", new StopEgressRequest({
            egressId
        }).toJson(), await this.authHeader({
            roomRecord: true
        }));
        return EgressInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
}
 //# sourceMappingURL=EgressClient.js.map

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/IngressClient.js



const IngressClient_svc = "Ingress";
class IngressClient extends (/* unused pure expression or super */ null && (ServiceBase)) {
    /**
   * @param host - hostname including protocol. i.e. 'https://<project>.livekit.cloud'
   * @param apiKey - API Key, can be set in env var LIVEKIT_API_KEY
   * @param secret - API Secret, can be set in env var LIVEKIT_API_SECRET
   */ constructor(host, apiKey, secret){
        super(apiKey, secret);
        this.rpc = new TwirpRpc(host, livekitPackage);
    }
    /**
   * @param inputType - protocol for the ingress
   * @param opts - CreateIngressOptions
   */ async createIngress(inputType, opts) {
        let name = "";
        let participantName = "";
        let participantIdentity = "";
        let bypassTranscoding = false;
        let url = "";
        if (opts == null) {
            throw new Error("options dictionary is required");
        }
        const roomName = opts.roomName;
        const enableTranscoding = opts.enableTranscoding;
        const audio = opts.audio;
        const video = opts.video;
        const participantMetadata = opts.participantMetadata;
        name = opts.name || "";
        participantName = opts.participantName || "";
        participantIdentity = opts.participantIdentity || "";
        bypassTranscoding = opts.bypassTranscoding || false;
        url = opts.url || "";
        if (typeof roomName == "undefined") {
            throw new Error("required roomName option not provided");
        }
        if (participantIdentity == "") {
            throw new Error("required participantIdentity option not provided");
        }
        const req = new CreateIngressRequest({
            inputType,
            name,
            roomName,
            participantIdentity,
            participantMetadata,
            participantName,
            bypassTranscoding,
            enableTranscoding,
            url,
            audio,
            video
        }).toJson();
        const data = await this.rpc.request(IngressClient_svc, "CreateIngress", req, await this.authHeader({
            ingressAdmin: true
        }));
        return IngressInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @param ingressId - ID of the ingress to update
   * @param opts - UpdateIngressOptions
   */ async updateIngress(ingressId, opts) {
        const name = opts.name || "";
        const roomName = opts.roomName || "";
        const participantName = opts.participantName || "";
        const participantIdentity = opts.participantIdentity || "";
        const { participantMetadata } = opts;
        const { audio, video, bypassTranscoding, enableTranscoding } = opts;
        const req = new UpdateIngressRequest({
            ingressId,
            name,
            roomName,
            participantIdentity,
            participantName,
            participantMetadata,
            bypassTranscoding,
            enableTranscoding,
            audio,
            video
        }).toJson();
        const data = await this.rpc.request(IngressClient_svc, "UpdateIngress", req, await this.authHeader({
            ingressAdmin: true
        }));
        return IngressInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @param arg - list room name or options
   */ async listIngress(arg) {
        let req = {};
        if (typeof arg === "string") {
            req.roomName = arg;
        } else if (arg) {
            req = arg;
        }
        const data = await this.rpc.request(IngressClient_svc, "ListIngress", new ListIngressRequest(req).toJson(), await this.authHeader({
            ingressAdmin: true
        }));
        return ListIngressResponse.fromJson(data, {
            ignoreUnknownFields: true
        }).items ?? [];
    }
    /**
   * @param ingressId - ingress to delete
   */ async deleteIngress(ingressId) {
        const data = await this.rpc.request(IngressClient_svc, "DeleteIngress", new DeleteIngressRequest({
            ingressId
        }).toJson(), await this.authHeader({
            ingressAdmin: true
        }));
        return IngressInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
}
 //# sourceMappingURL=IngressClient.js.map

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/TwirpRPC.js
const defaultPrefix = "/twirp";
const TwirpRPC_livekitPackage = "livekit";
class TwirpError extends Error {
    constructor(name, message, status, code){
        super(message);
        this.name = name;
        this.status = status;
        this.code = code;
    }
}
class TwirpRPC_TwirpRpc {
    constructor(host, pkg, prefix){
        if (host.startsWith("ws")) {
            host = host.replace("ws", "http");
        }
        this.host = host;
        this.pkg = pkg;
        this.prefix = prefix || defaultPrefix;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async request(service, method, data, headers) {
        const path = `${this.prefix}/${this.pkg}.${service}/${method}`;
        const url = new URL(path, this.host);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                ...headers
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const isJson = response.headers.get("content-type") === "application/json";
            let errorMessage = "Unknown internal error";
            let errorCode = void 0;
            try {
                if (isJson) {
                    const parsedError = await response.json();
                    if ("msg" in parsedError) {
                        errorMessage = parsedError.msg;
                    }
                    if ("code" in parsedError) {
                        errorCode = parsedError.code;
                    }
                } else {
                    errorMessage = await response.text();
                }
            } catch (e) {
                console.debug(`Error when trying to parse error message, using defaults`, e);
            }
            throw new TwirpError(response.statusText, errorMessage, response.status, errorCode);
        }
        const parsedResp = await response.json();
        const camelcaseKeys = await __webpack_require__.e(/* import() */ 545).then(__webpack_require__.bind(__webpack_require__, 9545)).then((mod)=>mod.default);
        return camelcaseKeys(parsedResp, {
            deep: true
        });
    }
}
 //# sourceMappingURL=TwirpRPC.js.map

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/crypto/uuid.js
async function getRandomBytes(size = 16) {
    if (globalThis.crypto) {
        return crypto.getRandomValues(new Uint8Array(size));
    } else {
        const nodeCrypto = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 6005, 19));
        return nodeCrypto.getRandomValues(new Uint8Array(size));
    }
}
 //# sourceMappingURL=uuid.js.map

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/RoomServiceClient.js




const RoomServiceClient_svc = "RoomService";
class RoomServiceClient extends ServiceBase_ServiceBase {
    /**
   *
   * @param host - hostname including protocol. i.e. 'https://<project>.livekit.cloud'
   * @param apiKey - API Key, can be set in env var LIVEKIT_API_KEY
   * @param secret - API Secret, can be set in env var LIVEKIT_API_SECRET
   */ constructor(host, apiKey, secret){
        super(apiKey, secret);
        this.rpc = new TwirpRPC_TwirpRpc(host, TwirpRPC_livekitPackage);
    }
    /**
   * Creates a new room. Explicit room creation is not required, since rooms will
   * be automatically created when the first participant joins. This method can be
   * used to customize room settings.
   * @param options -
   */ async createRoom(options) {
        const data = await this.rpc.request(RoomServiceClient_svc, "CreateRoom", new CreateRoomRequest(options).toJson(), await this.authHeader({
            roomCreate: true
        }));
        return Room.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * List active rooms
   * @param names - when undefined or empty, list all rooms.
   *                otherwise returns rooms with matching names
   * @returns
   */ async listRooms(names) {
        const data = await this.rpc.request(RoomServiceClient_svc, "ListRooms", new ListRoomsRequest({
            names: names ?? []
        }).toJson(), await this.authHeader({
            roomList: true
        }));
        const res = ListRoomsResponse.fromJson(data, {
            ignoreUnknownFields: true
        });
        return res.rooms ?? [];
    }
    async deleteRoom(room) {
        await this.rpc.request(RoomServiceClient_svc, "DeleteRoom", new DeleteRoomRequest({
            room
        }).toJson(), await this.authHeader({
            roomCreate: true
        }));
    }
    /**
   * Update metadata of a room
   * @param room - name of the room
   * @param metadata - the new metadata for the room
   */ async updateRoomMetadata(room, metadata) {
        const data = await this.rpc.request(RoomServiceClient_svc, "UpdateRoomMetadata", new UpdateRoomMetadataRequest({
            room,
            metadata
        }).toJson(), await this.authHeader({
            roomAdmin: true,
            room
        }));
        return Room.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * List participants in a room
   * @param room - name of the room
   */ async listParticipants(room) {
        const data = await this.rpc.request(RoomServiceClient_svc, "ListParticipants", new ListParticipantsRequest({
            room
        }).toJson(), await this.authHeader({
            roomAdmin: true,
            room
        }));
        const res = ListParticipantsResponse.fromJson(data, {
            ignoreUnknownFields: true
        });
        return res.participants ?? [];
    }
    /**
   * Get information on a specific participant, including the tracks that participant
   * has published
   * @param room - name of the room
   * @param identity - identity of the participant to return
   */ async getParticipant(room, identity) {
        const data = await this.rpc.request(RoomServiceClient_svc, "GetParticipant", new RoomParticipantIdentity({
            room,
            identity
        }).toJson(), await this.authHeader({
            roomAdmin: true,
            room
        }));
        return ParticipantInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * Removes a participant in the room. This will disconnect the participant
   * and will emit a Disconnected event for that participant.
   * Even after being removed, the participant can still re-join the room.
   * @param room -
   * @param identity -
   */ async removeParticipant(room, identity) {
        await this.rpc.request(RoomServiceClient_svc, "RemoveParticipant", new RoomParticipantIdentity({
            room,
            identity
        }).toJson(), await this.authHeader({
            roomAdmin: true,
            room
        }));
    }
    /**
   * Mutes a track that the participant has published.
   * @param room -
   * @param identity -
   * @param trackSid - sid of the track to be muted
   * @param muted - true to mute, false to unmute
   */ async mutePublishedTrack(room, identity, trackSid, muted) {
        const req = new MuteRoomTrackRequest({
            room,
            identity,
            trackSid,
            muted
        }).toJson();
        const data = await this.rpc.request(RoomServiceClient_svc, "MutePublishedTrack", req, await this.authHeader({
            roomAdmin: true,
            room
        }));
        const res = MuteRoomTrackResponse.fromJson(data, {
            ignoreUnknownFields: true
        });
        return res.track;
    }
    async updateParticipant(room, identity, metadataOrOptions, maybePermission, maybeName) {
        const hasOptions = typeof metadataOrOptions === "object";
        const metadata = hasOptions ? metadataOrOptions == null ? void 0 : metadataOrOptions.metadata : metadataOrOptions;
        const permission = hasOptions ? metadataOrOptions.permission : maybePermission;
        const name = hasOptions ? metadataOrOptions.name : maybeName;
        const attributes = hasOptions ? metadataOrOptions.attributes : {};
        const req = new UpdateParticipantRequest({
            room,
            identity,
            attributes,
            metadata,
            name
        });
        if (permission) {
            req.permission = new ParticipantPermission(permission);
        }
        const data = await this.rpc.request(RoomServiceClient_svc, "UpdateParticipant", req.toJson(), await this.authHeader({
            roomAdmin: true,
            room
        }));
        return ParticipantInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * Updates a participant's subscription to tracks
   * @param room -
   * @param identity -
   * @param trackSids -
   * @param subscribe - true to subscribe, false to unsubscribe
   */ async updateSubscriptions(room, identity, trackSids, subscribe) {
        const req = new UpdateSubscriptionsRequest({
            room,
            identity,
            trackSids,
            subscribe,
            participantTracks: []
        }).toJson();
        await this.rpc.request(RoomServiceClient_svc, "UpdateSubscriptions", req, await this.authHeader({
            roomAdmin: true,
            room
        }));
    }
    async sendData(room, data, kind, options = {}) {
        const destinationSids = Array.isArray(options) ? options : options.destinationSids;
        const topic = Array.isArray(options) ? void 0 : options.topic;
        const req = new SendDataRequest({
            room,
            data,
            kind,
            destinationSids: destinationSids ?? [],
            topic
        });
        if (!Array.isArray(options) && options.destinationIdentities) {
            req.destinationIdentities = options.destinationIdentities;
        }
        req.nonce = await getRandomBytes(16);
        await this.rpc.request(RoomServiceClient_svc, "SendData", req.toJson(), await this.authHeader({
            roomAdmin: true,
            room
        }));
    }
}
 //# sourceMappingURL=RoomServiceClient.js.map

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/SipClient.js




const SipClient_svc = "SIP";
class SipClient extends (/* unused pure expression or super */ null && (ServiceBase)) {
    /**
   * @param host - hostname including protocol. i.e. 'https://<project>.livekit.cloud'
   * @param apiKey - API Key, can be set in env var LIVEKIT_API_KEY
   * @param secret - API Secret, can be set in env var LIVEKIT_API_SECRET
   */ constructor(host, apiKey, secret){
        super(apiKey, secret);
        this.rpc = new TwirpRpc(host, livekitPackage);
    }
    /**
   * @param number - phone number of the trunk
   * @param opts - CreateSipTrunkOptions
   * @deprecated use `createSipInboundTrunk` or `createSipOutboundTrunk`
   */ async createSipTrunk(number, opts) {
        let inboundAddresses;
        let inboundNumbers;
        let inboundUsername = "";
        let inboundPassword = "";
        let outboundAddress = "";
        let outboundUsername = "";
        let outboundPassword = "";
        let name = "";
        let metadata = "";
        if (opts !== void 0) {
            inboundAddresses = opts.inbound_addresses;
            inboundNumbers = opts.inbound_numbers;
            inboundUsername = opts.inbound_username || "";
            inboundPassword = opts.inbound_password || "";
            outboundAddress = opts.outbound_address || "";
            outboundUsername = opts.outbound_username || "";
            outboundPassword = opts.outbound_password || "";
            name = opts.name || "";
            metadata = opts.metadata || "";
        }
        const req = new CreateSIPTrunkRequest({
            name,
            metadata,
            inboundAddresses,
            inboundNumbers,
            inboundUsername,
            inboundPassword,
            outboundNumber: number,
            outboundAddress,
            outboundUsername,
            outboundPassword
        }).toJson();
        const data = await this.rpc.request(SipClient_svc, "CreateSIPTrunk", req, await this.authHeader({}, {
            admin: true
        }));
        return SIPTrunkInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @param name - human-readable name of the trunk
   * @param numbers - phone numbers of the trunk
   * @param opts - CreateSipTrunkOptions
   */ async createSipInboundTrunk(name, numbers, opts) {
        if (opts === void 0) {
            opts = {};
        }
        const req = new CreateSIPInboundTrunkRequest({
            trunk: new SIPInboundTrunkInfo({
                name,
                numbers,
                metadata: opts == null ? void 0 : opts.metadata,
                allowedAddresses: opts.allowedAddresses ?? opts.allowed_addresses,
                allowedNumbers: opts.allowedNumbers ?? opts.allowed_numbers,
                authUsername: opts.authUsername ?? opts.auth_username,
                authPassword: opts.authPassword ?? opts.auth_password,
                headers: opts.headers,
                headersToAttributes: opts.headersToAttributes,
                includeHeaders: opts.includeHeaders,
                krispEnabled: opts.krispEnabled
            })
        }).toJson();
        const data = await this.rpc.request(SipClient_svc, "CreateSIPInboundTrunk", req, await this.authHeader({}, {
            admin: true
        }));
        return SIPInboundTrunkInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @param name - human-readable name of the trunk
   * @param address - hostname and port of the SIP server to dial
   * @param numbers - phone numbers of the trunk
   * @param opts - CreateSipTrunkOptions
   */ async createSipOutboundTrunk(name, address, numbers, opts) {
        if (opts === void 0) {
            opts = {
                transport: SIPTransport.SIP_TRANSPORT_AUTO
            };
        }
        const req = new CreateSIPOutboundTrunkRequest({
            trunk: new SIPOutboundTrunkInfo({
                name,
                address,
                numbers,
                metadata: opts.metadata,
                transport: opts.transport,
                authUsername: opts.authUsername ?? opts.auth_username,
                authPassword: opts.authPassword ?? opts.auth_password,
                headers: opts.headers,
                headersToAttributes: opts.headersToAttributes,
                includeHeaders: opts.includeHeaders
            })
        }).toJson();
        const data = await this.rpc.request(SipClient_svc, "CreateSIPOutboundTrunk", req, await this.authHeader({}, {
            admin: true
        }));
        return SIPOutboundTrunkInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @deprecated use `listSipInboundTrunk` or `listSipOutboundTrunk`
   */ async listSipTrunk() {
        const req = {};
        const data = await this.rpc.request(SipClient_svc, "ListSIPTrunk", new ListSIPTrunkRequest(req).toJson(), await this.authHeader({}, {
            admin: true
        }));
        return ListSIPTrunkResponse.fromJson(data, {
            ignoreUnknownFields: true
        }).items ?? [];
    }
    async listSipInboundTrunk() {
        const req = {};
        const data = await this.rpc.request(SipClient_svc, "ListSIPInboundTrunk", new ListSIPInboundTrunkRequest(req).toJson(), await this.authHeader({}, {
            admin: true
        }));
        return ListSIPInboundTrunkResponse.fromJson(data, {
            ignoreUnknownFields: true
        }).items ?? [];
    }
    async listSipOutboundTrunk() {
        const req = {};
        const data = await this.rpc.request(SipClient_svc, "ListSIPOutboundTrunk", new ListSIPOutboundTrunkRequest(req).toJson(), await this.authHeader({}, {
            admin: true
        }));
        return ListSIPOutboundTrunkResponse.fromJson(data, {
            ignoreUnknownFields: true
        }).items ?? [];
    }
    /**
   * @param sipTrunkId - sip trunk to delete
   */ async deleteSipTrunk(sipTrunkId) {
        const data = await this.rpc.request(SipClient_svc, "DeleteSIPTrunk", new DeleteSIPTrunkRequest({
            sipTrunkId
        }).toJson(), await this.authHeader({}, {
            admin: true
        }));
        return SIPTrunkInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @param rule - sip dispatch rule
   * @param opts - CreateSipDispatchRuleOptions
   */ async createSipDispatchRule(rule, opts) {
        if (opts === void 0) {
            opts = {};
        }
        let ruleProto = void 0;
        if (rule.type == "direct") {
            ruleProto = new SIPDispatchRule({
                rule: {
                    case: "dispatchRuleDirect",
                    value: new SIPDispatchRuleDirect({
                        roomName: rule.roomName,
                        pin: rule.pin || ""
                    })
                }
            });
        } else if (rule.type == "individual") {
            ruleProto = new SIPDispatchRule({
                rule: {
                    case: "dispatchRuleIndividual",
                    value: new SIPDispatchRuleIndividual({
                        roomPrefix: rule.roomPrefix,
                        pin: rule.pin || ""
                    })
                }
            });
        }
        const req = new CreateSIPDispatchRuleRequest({
            rule: ruleProto,
            trunkIds: opts.trunkIds,
            hidePhoneNumber: opts.hidePhoneNumber,
            name: opts.name,
            metadata: opts.metadata,
            attributes: opts.attributes,
            roomPreset: opts.roomPreset,
            roomConfig: opts.roomConfig
        }).toJson();
        const data = await this.rpc.request(SipClient_svc, "CreateSIPDispatchRule", req, await this.authHeader({}, {
            admin: true
        }));
        return SIPDispatchRuleInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    async listSipDispatchRule() {
        const req = {};
        const data = await this.rpc.request(SipClient_svc, "ListSIPDispatchRule", new ListSIPDispatchRuleRequest(req).toJson(), await this.authHeader({}, {
            admin: true
        }));
        return ListSIPDispatchRuleResponse.fromJson(data, {
            ignoreUnknownFields: true
        }).items ?? [];
    }
    /**
   * @param sipDispatchRuleId - sip trunk to delete
   */ async deleteSipDispatchRule(sipDispatchRuleId) {
        const data = await this.rpc.request(SipClient_svc, "DeleteSIPDispatchRule", new DeleteSIPDispatchRuleRequest({
            sipDispatchRuleId
        }).toJson(), await this.authHeader({}, {
            admin: true
        }));
        return SIPDispatchRuleInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @param sipTrunkId - sip trunk to use for the call
   * @param number - number to dial
   * @param roomName - room to attach the call to
   * @param opts - CreateSipParticipantOptions
   */ async createSipParticipant(sipTrunkId, number, roomName, opts) {
        if (opts === void 0) {
            opts = {};
        }
        const req = new CreateSIPParticipantRequest({
            sipTrunkId,
            sipCallTo: number,
            sipNumber: opts.fromNumber,
            roomName,
            participantIdentity: opts.participantIdentity || "sip-participant",
            participantName: opts.participantName,
            participantMetadata: opts.participantMetadata,
            participantAttributes: opts.participantAttributes,
            dtmf: opts.dtmf,
            playDialtone: opts.playDialtone ?? opts.playRingtone,
            headers: opts.headers,
            hidePhoneNumber: opts.hidePhoneNumber,
            includeHeaders: opts.includeHeaders,
            ringingTimeout: opts.ringingTimeout ? new Duration({
                seconds: BigInt(opts.ringingTimeout)
            }) : void 0,
            maxCallDuration: opts.maxCallDuration ? new Duration({
                seconds: BigInt(opts.maxCallDuration)
            }) : void 0,
            krispEnabled: opts.krispEnabled
        }).toJson();
        const data = await this.rpc.request(SipClient_svc, "CreateSIPParticipant", req, await this.authHeader({}, {
            call: true
        }));
        return SIPParticipantInfo.fromJson(data, {
            ignoreUnknownFields: true
        });
    }
    /**
   * @param roomName - room the SIP participant to transfer is connectd to
   * @param participantIdentity - identity of the SIP participant to transfer
   * @param transferTo - SIP URL to transfer the participant to
   */ async transferSipParticipant(roomName, participantIdentity, transferTo, opts) {
        if (opts === void 0) {
            opts = {};
        }
        const req = new TransferSIPParticipantRequest({
            participantIdentity,
            roomName,
            transferTo,
            playDialtone: opts.playDialtone,
            headers: opts.headers
        }).toJson();
        await this.rpc.request(SipClient_svc, "TransferSIPParticipant", req, await this.authHeader({
            roomAdmin: true,
            room: roomName
        }, {
            call: true
        }));
    }
}
 //# sourceMappingURL=SipClient.js.map

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/WebhookReceiver.js



const authorizeHeader = "Authorize";
class WebhookReceiver_WebhookEvent extends (/* unused pure expression or super */ null && (ProtoWebhookEvent)) {
    constructor(){
        super(...arguments);
        this.event = "";
    }
    static fromBinary(bytes, options) {
        return new WebhookReceiver_WebhookEvent().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
        return new WebhookReceiver_WebhookEvent().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
        return new WebhookReceiver_WebhookEvent().fromJsonString(jsonString, options);
    }
}
class WebhookReceiver {
    constructor(apiKey, apiSecret){
        this.verifier = new TokenVerifier(apiKey, apiSecret);
    }
    /**
   * @param body - string of the posted body
   * @param authHeader - `Authorization` header from the request
   * @param skipAuth - true to skip auth validation
   * @returns
   */ async receive(body, authHeader, skipAuth = false) {
        if (!skipAuth) {
            if (!authHeader) {
                throw new Error("authorization header is empty");
            }
            const claims = await this.verifier.verify(authHeader);
            const hash = await digest(body);
            const hashDecoded = btoa(Array.from(new Uint8Array(hash)).map((v)=>String.fromCharCode(v)).join(""));
            if (claims.sha256 !== hashDecoded) {
                throw new Error("sha256 checksum of body does not match");
            }
        }
        return WebhookReceiver_WebhookEvent.fromJson(JSON.parse(body), {
            ignoreUnknownFields: true
        });
    }
}
 //# sourceMappingURL=WebhookReceiver.js.map

;// CONCATENATED MODULE: ./node_modules/livekit-server-sdk/dist/index.js









 //# sourceMappingURL=index.js.map


/***/ })

};
;