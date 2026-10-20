"""Explicit, private-network opt-in for temporary mobile testing."""
import os
from ipaddress import ip_address, ip_network
from urllib.parse import urlsplit

LOCAL_ORIGIN = 'http://localhost:3000'
LAN_ORIGIN = os.getenv('WISCONNECT_LAN_ORIGIN', '')
LAN_NETWORK = None
LAN_HOST = None


def validate_lan(origin, network):
    parsed = urlsplit(origin)
    address = ip_address(parsed.hostname or '')
    subnet = ip_network(network, strict=True)
    private = [ip_network(value) for value in ('10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16')]
    if (parsed.scheme != 'http' or parsed.username or parsed.password
            or parsed.path or parsed.query or parsed.fragment or not parsed.port
            or address.version != 4 or subnet.version != 4
            or not any(subnet.subnet_of(block) for block in private)
            or subnet.prefixlen < 24 or address not in subnet
            or address in {subnet.network_address, subnet.broadcast_address}
            or origin != f'http://{address}:{parsed.port}'):
        raise ValueError('Use an exact HTTP private IPv4 origin and its /24 or smaller local subnet.')
    return str(address), subnet


if LAN_ORIGIN:
    if os.getenv('WISCONNECT_LOCAL_AUTH') != '1':
        raise ValueError('Mobile preview requires the explicit local authentication pilot.')
    LAN_HOST, LAN_NETWORK = validate_lan(LAN_ORIGIN, os.getenv('WISCONNECT_LAN_CIDR', ''))

ORIGIN = LAN_ORIGIN or LOCAL_ORIGIN


def allowed_client(host):
    try:
        return ip_address(host) in LAN_NETWORK if LAN_NETWORK else host in {'127.0.0.1', '::1'}
    except ValueError:
        return False
