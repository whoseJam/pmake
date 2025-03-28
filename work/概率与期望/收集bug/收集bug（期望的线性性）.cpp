// This is wrong, why? 

#include<iostream>
#include<cstring>
#include<cstdio>
#include<map>
using namespace std;

namespace FastIO{
	const int L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

int n,s;

double E(int i,int j){
	double di=i;
	double dj=j;
	double dn=n;
	double ds=s;
	return (dn*ds)/(dn*ds-di*dj);
}

int main(){
	n=read();s=read();
	double ans=E(0,0);
	for(int i=1;i<=n;i++){
		for(int j=1;j<=s;j++){
			if(i==n&&j==s)continue;
			ans+=E(i,j);
		}
	}
	printf("%.4lf\n",ans);
	return 0;
}

