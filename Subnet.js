/**
* Subnet.js
* Copyright 2018 by Arief M. Ikhsan
*/
class Subnet{

	constructor(ip, network_size){
		this.ip = ip;
		this.network_size = network_size;
		this.quads = this.ip.split('.');
		this.subnet_mask = 0xFFFFFFFF << (32 - this.network_size);
	}

	getIPAddress(){
		return this.ip;
	}

	getNetworkSize(){
		return this.network_size;
	}

	getSubnetMask(){
		return this.subnet_mask;
	}

	getNumberIPAddress(){
		return Math.pow(2, (32 - this.network_size)) ;
	}

	getNumberAvailableHosts(){
		let n;
		if (this.network_size==32) {
			n = 1;
		} else if(this.network_size==31){
			n = 2;
		} else {
			n = (this.getNumberIPAddress() - 2);
		}
		return n;
	}

	getIPRange(){
		let first_ip = this.getNetworkQuads();
		let last_ip = this.getBroadcastQuads();
		first_ip = first_ip.join('.');
		last_ip = last_ip.join('.');
		return first_ip+' - '+last_ip;
	}

	getNetworkQuads(){
		let network_quads = [];
		network_quads[0] = this.quads[0] & (this.subnet_mask >> 24);
		network_quads[1] = this.quads[1] & (this.subnet_mask >> 16);
		network_quads[2] = this.quads[2] & (this.subnet_mask >> 8);
		network_quads[3] = this.quads[3] & (this.subnet_mask >> 0);
		return network_quads;
	}

	getBroadcastQuads(){
		let broadcast_quads = [];
		let network_quads = this.getNetworkQuads();
		let number_ip = this.getNumberIPAddress();
		broadcast_quads[0] = ( network_quads[0] & ( this.subnet_mask >> 24 ) ) + ( ( (number_ip - 1) >> 24 ) & 0xFF );
		broadcast_quads[1] = ( network_quads[1] & ( this.subnet_mask >> 16 ) ) + ( ( (number_ip - 1) >> 16 ) & 0xFF );
		broadcast_quads[2] = ( network_quads[2] & ( this.subnet_mask >> 8 ) ) + ( ( (number_ip - 1) >> 8 ) & 0xFF );
		broadcast_quads[3] = ( network_quads[3] & ( this.subnet_mask >> 0 ) ) + ( ( (number_ip - 1) >> 0 ) & 0xFF );
		return broadcast_quads;
	}

	validateInput(){
		let reg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
		let validIP = reg.test(this.ip);
		if (validIP) {
			if (this.network_size>=1 && this.network_size<=32) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	getReport(){
		let data = {};
		if (this.validateInput()) {
			data = {
				status : 'success',
				ip : this.getIPAddress(),
				network : this.getNetworkSize(),
				ip_total : this.getNumberIPAddress(),
				ip_usable : this.getNumberAvailableHosts(),
				ip_range : this.getIPRange(),
				ip_network : this.getNetworkQuads().join('.'),
				ip_broadcast : this.getBroadcastQuads().join('.')
			}
		} else {
			data = {
				status : 'failed',
				message : 'Invalid input'
			};
		}
		return data;
	}
}
