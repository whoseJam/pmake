#include<iostream>
#include<cstdio>
#include<cstring>
#define ll long long
using namespace std;
ll N,a[10005],b[10005],M=1,ans=0;

void EXgcd(ll A,ll B,ll &x,ll &y,ll &gcd){
	if(!B){x=1;y=0;gcd=A;return;}
	EXgcd(B,A%B,x,y,gcd);
	ll tmp=x;x=y;y=tmp-(A/B)*y;
}

int main(){
	cin>>N;
	for(ll i=1;i<=N;i++)cin>>a[i]>>b[i],M*=a[i];
	for(ll i=1;i<=N;i++){
		ll Mi=M/a[i],B=a[i],gcd,x0,y0,x;
		EXgcd(Mi,B,x0,y0,gcd);
		ans=((ans+Mi*x0*b[i])%M+M)%M;
	}
	cout<<ans;
	return 0;
}
