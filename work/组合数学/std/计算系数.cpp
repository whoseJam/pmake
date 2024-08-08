#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

typedef long long ll;
const ll mod=10007;
ll fac[1005],finv[1005],inv[1005];
ll A,B,K,N,M;

void Pre(ll n=1000){
	inv[1]=finv[1]=fac[1]=finv[0]=fac[0]=1;
	for(ll i=2;i<=n;i++){
		fac[i]=fac[i-1]*i%mod;
		inv[i]=((-inv[mod%i]*(mod/i)%mod)+mod)%mod;
		finv[i]=finv[i-1]*inv[i]%mod;
	}
}

ll C(ll n,ll m){
	return fac[n]*finv[m]%mod*finv[n-m]%mod;
}

ll Fastpow(ll a,ll b){
	ll ans=1;
	while(b){
		if(b&1)ans=(ans*a)%mod;
		b>>=1;a=(a*a)%mod;
	}
	return ans;
}

int main(){
	cin>>A>>B>>K>>N>>M;Pre();
	cout<<(C(K,N)*Fastpow(A,N)*Fastpow(B,M))%mod;
	return 0;
}
