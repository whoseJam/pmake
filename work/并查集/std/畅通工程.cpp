#include<bits/stdc++.h>
using namespace std;

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

const int N=1005;
int n,m,fa[N];

int F(int x){
	if(fa[x]==x)return x;
	return fa[x]=F(fa[x]);
}

void Merge(int x,int y){
	fa[F(x)]=F(y);
}

int main(){
	n=read();
	while(n!=0){
		m=read();
		for(int i=1;i<=n;i++)fa[i]=i;
		for(int i=1,x,y;i<=m;i++){
			x=read();y=read();
			Merge(x,y);
		}
		int ans=0;
		for(int i=1;i<=n;i++)
			if(F(i)==i)ans++;
		cout<<ans-1<<'\n';
		
		n=read();
	}
	return 0;
}

