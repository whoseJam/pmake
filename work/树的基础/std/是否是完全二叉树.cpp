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

const int N=10005;
int n,ch[N][2],rt;

struct line{
	int Nxt,to,a,b;
}l[N*2];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v,u,v};h[u]=cnt;
	l[++cnt]=(line){h[v],u,u,v};h[v]=cnt;
}

void Dfs(int u,int f,int d){
	for(int i=h[u],v;i;i=l[i].Nxt){
		v=l[i].to;
		if(v==f)continue;
		if(l[i].a==u&&l[i].b==v)ch[u][0]=v;
		else ch[u][1]=v;
	}
	if(ch[u][0])Dfs(ch[u][0],u,d+1);
	if(ch[u][1])Dfs(ch[u][1],u,d+1);
}

int main(){
	n=read();rt=read();
	for(int i=1,a,b;i<n;i++){
		a=read();b=read();
		Link(a,b);
	}
	Dfs(rt,0,1);
	
	queue<int>q;
	q.push(rt);int tot=0;
	while(q.size()){
		int u=q.front();q.pop();tot++;
		if(ch[u][0])q.push(ch[u][0]);
		else break;
		if(ch[u][1])q.push(ch[u][1]);
		else break;
	}
	if(tot+q.size()==n)cout<<"yes\n";
	else cout<<"no\n";
	return 0;
}

