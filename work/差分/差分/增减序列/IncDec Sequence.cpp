#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

typedef long long ll;

namespace FastIO{
	const ll L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline ll read(){
		ll s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const ll N=100005;
ll a[N],d[N],n,pos,neg;

int main(){
	n=read();
	for(ll i=1;i<=n;i++){
		a[i]=read();
		d[i]=a[i]-a[i-1];
	}
	for(ll i=2;i<=n;i++){
		if(d[i]>0)pos+=d[i];
		else neg+=abs(d[i]);
	}
	ll mx=max(pos,neg);
	ll mn=min(pos,neg);
	cout<<mx<<'\n';
	cout<<mx-mn+1<<'\n';
	return 0;
}

