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

const int N=2005;
int fa[N],n,m;

int GetFa(int x){
	if(fa[x]==x)return x;
	return fa[x]=GetFa(fa[x]);
}

void Merge(int x,int y){
	int fx=GetFa(x),fy=GetFa(y);
	if(fx!=fy)fa[fx]=fy;
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n*2;i++)fa[i]=i;
	
	char opt[3];
	for(int i=1,x,y;i<=m;i++){
		scanf("%s",opt);x=read();y=read();
		if(opt[0]=='E'){
			Merge(x+n,y);
			Merge(y+n,x);
		}
		else Merge(x,y);
	}
	
	int ans=0;
	for(int i=1;i<=n;i++){
		if(GetFa(i)==i)ans++;
	}
	cout<<ans;
	return 0;
}

