// https://github.com/tilkinsc/JSOTP
// Modificada en detalles 24/05/2025

export function b64_hmac_sha1(k,d,_p,_z){
  if(!_p){_p='=';}if(!_z){_z=8;}function _f(t,b,c,d){if(t<20){return(b&c)|((~b)&d);}if(t<40){return b^c^d;}if(t<60){return(b&c)|(b&d)|(c&d);}return b^c^d;}function _k(t){return(t<20)?1518500249:(t<40)?1859775393:(t<60)?-1894007588:-899497514;}function _s(x,y){var l=(x&0xFFFF)+(y&0xFFFF),m=(x>>16)+(y>>16)+(l>>16);return(m<<16)|(l&0xFFFF);}function _r(n,c){return(n<<c)|(n>>>(32-c));}function _c(x,l){x[l>>5]|=0x80<<(24-l%32);x[((l+64>>9)<<4)+15]=l;var w=[80],a=1732584193,b=-271733879,c=-1732584194,d=271733878,e=-1009589776;for(var i=0;i<x.length;i+=16){var o=a,p=b,q=c,r=d,s=e;for(var j=0;j<80;j++){if(j<16){w[j]=x[i+j];}else{w[j]=_r(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);}var t=_s(_s(_r(a,5),_f(j,b,c,d)),_s(_s(e,w[j]),_k(j)));e=d;d=c;c=_r(b,30);b=a;a=t;}a=_s(a,o);b=_s(b,p);c=_s(c,q);d=_s(d,r);e=_s(e,s);}return[a,b,c,d,e];}function _b(s){var b=[],m=(1<<_z)-1;for(var i=0;i<s.length*_z;i+=_z){b[i>>5]|=(s.charCodeAt(i/8)&m)<<(32-_z-i%32);}return b;}function _h(k,d){var b=_b(k);if(b.length>16){b=_c(b,k.length*_z);}var p=[16],o=[16];for(var i=0;i<16;i++){p[i]=b[i]^0x36363636;o[i]=b[i]^0x5C5C5C5C;}var h=_c(p.concat(_b(d)),512+d.length*_z);return _c(o.concat(h),512+160);}function _n(b){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s='';for(var i=0;i<b.length*4;i+=3){var r=(((b[i>>2]>>8*(3-i%4))&0xFF)<<16)|(((b[i+1>>2]>>8*(3-(i+1)%4))&0xFF)<<8)|((b[i+2>>2]>>8*(3-(i+2)%4))&0xFF);for(var j=0;j<4;j++){if(i*8+j*6>b.length*32){s+=_p;}else{s+=t.charAt((r>>6*(3-j))&0x3F);}}}return s;}function _x(k,d){return _n(_h(k,d));}return _x(k,d);
}


export function encrypt_sha1(byte_secret, byte_string) {
	return new Int8Array(atob(b64_hmac_sha1(String.fromCharCode.apply(String, byte_secret), String.fromCharCode.apply(String, byte_string))).split('').map(x => x.charCodeAt(0)));
}


export const OTP_DEFAULT_BASE32_CHARS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '2', '3', '4', '5', '6', '7'];

export const OTPType = {OTP : 0, TOTP : 1, HOTP : 2};

export class OTP {

	constructor(base32_secret, bits, algo, digest, digits) {
		this.base32_secret = base32_secret;
		this.bits = bits;
		this.algo = algo;
		this.digest = digest;
		this.digits = digits;
		this.method = OTPType.OTP;
	}

	generate(input, out) {
		let secret_len = this.base32_secret.length;
		let desired_secret_len = (secret_len / 8) * 5;

		if (this.bits % 8 != 0){
			console.error("generate `this.bits` must be divisble by 8 (got ", this.bits, ")");
			return
		}

		let bit_size = this.bits / 8;

		let byte_string = this.int_to_bytestring(input);
		let byte_secret = this.byte_secret(secret_len, desired_secret_len + 1);
		let hmac = this.algo(byte_secret, byte_string);

		if (hmac == null){
			console.error("generate `hmac` returned null from supplied decrypt function");
			return
		}

		let offset = (hmac[bit_size - 1] & 0xF);
		let code =
			(
			 (hmac[offset] & 0x7F) << 24 |
			 (hmac[offset+1] & 0xFF) << 16 |
			 (hmac[offset+2] & 0xFF) << 8 |
			 (hmac[offset+3] & 0xFF)
			) % parseInt(Math.pow(10, this.digits));

		return out ? code.toString().padStart(this.digits, '0').split('') : code;
	}

	byte_secret(size, len) {
		if (size % 8 != 0){
			console.error("byte_secret `size` must be divisble by 8 (got ", size, ")");
			return
		}

		let out_str = new Int8Array(len);

		let n = 5;
		for (let i=0; ; i++) {
			n = -1;
			out_str[i*5] = 0;
			for (let block=0; block<8; block++) {
				let offset = (3 - (5*block) % 8);
				let octet = (block*5) / 8;

				let c = 0;
				if(i*8+block < size)
					c = this.base32_secret.charCodeAt(i*8 + block) & 0xFF;

				if (c >= 65 && c <= 90)
					n = c - 65;
				if (c >= 50 && c <= 55)
					n = 26 + c - 50;
				if (n < 0) {
					n = octet;
					break;
				}

				out_str[parseInt(i*5+octet)] |= -offset > 0 ? n >> -offset : n << offset;
				if (offset < 0)
					out_str[parseInt(i*5+octet+1)] = -(8 + offset) > 0 ? n >> -(8 + offset) : n << (8 + offset);
			}
			if (n < 5)
				break;
		}
		return out_str;
	}

	int_to_bytestring(integer) {
		return new Int8Array(['\0', '\0', '\0', '\0', (integer >> 24), (integer >> 16), (integer >> 8), integer], '\0');
	}

	static random_base32(len, chars = OTP_DEFAULT_BASE32_CHARS) {
		len = len > 0 ? len : 16;
		if (len % 8 != 0){
			console.exception("random_base32 `len` must be divisble by 8 (got", len, ")");
			return
		}
		let bytes = [];
		for (let i=0; i<len; i++){
			bytes[i] = chars[parseInt((Math.random() * (1024 - 0) + 0) % 32)];
		}
		console.log(bytes)
		return bytes;
	}

}

export class TOTP extends OTP {


	constructor(base32_secret, bits, algo, digest, digits, interval) {
		super(base32_secret, bits, algo, digest, digits);
		this.interval = interval;
		super.method = OTPType.TOTP;
	}

	compare(key, increment, for_time) {
		if(typeof(key) === "number")
			key = key.toString().padStart(this.digits, '0').split('');
		let time_str = this.at(for_time, increment, true);

		for (let i=0; i<key.length; i++)
			if(i > time_str.length || key[i] != time_str[i])
				return false;
		return true;
	}

	at(for_time, counter_offset, out) {
		return super.generate(this.timecode(for_time) + counter_offset, out);
	}

	now(out) {
		return super.generate(this.timecode(new Date().getTime()/1000), out);
	}

	verify(key, for_time, valid_window) {
		if (valid_window < 0)
			return false;
		if (valid_window > 0) {
			for (let i=-valid_window; i<valid_window; i++) {
				if (this.compare(key, i, for_time) === true)
					return true;
			}
		}
		return this.compare(key, 0, for_time);
	}

	valid_until(for_time, valid_window) {
		return for_time + (super.interval * valid_window);
	}

	timecode(for_time) {
		if (for_time <= 0)
			return 0;
		return parseInt(for_time/this.interval);
	}

}

export class HOTP extends OTP {


	constructor(base32_secret, bits, algo, digest, digits) {
		super(base32_secret, bits, algo, digest, digits);
		super.method = OTPType.HOTP;
	}

	compare(key, counter) {
		if(typeof key === "number")
			key = key.toString().padStart(this.digits, '0').split('');
		let time_str = this.at(counter, true);

		for (let i=0; i<key.length; i++)
			if(i > time_str.length || key[i] != time_str[i])
				return false;
		return true;
	}

	at(counter, out) {
		return super.generate(counter, out);
	}

	verify(key, counter) {
		return this.compare(key, counter);
	}

}

export class OTPURI {

	static build_uri(data, issuer, name, counter) {
		let cissuer = encodeURIComponent(issuer);

		let postarg = "";
		let otp_type = "";
		switch(data.method) {
			case OTPType.TOTP:
				otp_type = "totp";
				postarg += "&period=" + data.interval;
				break;
			case OTPType.HOTP:
				otp_type = "hotp";
				postarg += "&counter=" + counter;
				break;
			default:
				otp_type = "otp";
				break;
		}

		let pre = "otpauth://" + otp_type + "/" + cissuer + ":" + encodeURIComponent(name);
		let args =
			"?secret=" + encodeURIComponent(data.base32_secret) +
			"&issuer=" + cissuer +
			"&algorithm=" + encodeURIComponent(data.digest) +
			"&digits=" + data.digits;
		return pre + args + postarg;
	}

}
