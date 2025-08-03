#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;
typedef long long ll; 

int read(){
	int s=0,f=1;char t=getchar();
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

ll Exgcd(ll a,ll b,ll &x,ll &y){
	if(!b){x=1;y=0;return a;}
	ll x0,y0;
	ll d=Exgcd(b,a%b,x0,y0);
	x=y0;y=x0-(a/b)*y0;
	return d;
}

void Solve(ll a,ll b,ll c){ // ax+by=c, min(x)
	ll x,y;
	ll d=Exgcd(a,b,x,y);
	if(c%d!=0){cout<<"FOREVER"<<endl;return;}
	ll k=c/d,tmp=b/d;
	x=k*x;
	x=(x%tmp+tmp)%tmp;
	cout<<x<<endl;
}

int main(){
	ll a,b,c,k;
	while(true){
		a=read();b=read();c=read();k=read();
		if(a==0&&b==0&&c==0&&k==0)break;
		Solve(c,(1ll<<k),b-a);
	}
	return 0;
}
