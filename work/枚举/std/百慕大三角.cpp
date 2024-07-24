#include<bits/stdc++.h>
using namespace std;
typedef long long ll;

const ll Mod=998244353;

ll S1(ll l,ll r){
	if((l+r)%2==0)return (l+r)/2%Mod*(r-l+1)%Mod;
	return (r-l+1)/2%Mod*(l+r)%Mod;
}

int main(){
	ll n;
	cin>>n;n%=Mod;
	ll red=(n*n-n)%Mod*n%Mod*S1(0,n-1)%Mod;
	ll orange=2*n%Mod*(n-1)%Mod*S1(0,n-1)%Mod;
	ll ans=red*2-orange;
	ans=(ans%Mod+Mod)%Mod;
	cout<<ans;
	return 0;
}
