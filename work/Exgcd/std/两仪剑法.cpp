#include<iostream>
using namespace std;
typedef long long ll;

ll read(){
	ll s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

ll gcd(ll a,ll b){
	if(!b)return a;
	return gcd(b,a%b);
}

ll lcm(ll a,ll b){
	return a/gcd(a,b)*b;
}
 
int main(){
	ll n=read();
	for(ll i=1;i<=n;i++)
		cout<<lcm(read(),read())<<'\n';
	return 0;
}
