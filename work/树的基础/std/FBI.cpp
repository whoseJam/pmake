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

int n;
char s[4000];

struct Node{
	char typ;
	int ch[2];
}d[4000];
int tot;

int Dfs(int l,int r){
    int id=++tot;
    bool has0=false,has1=false;
    for(int i=l;i<=r;i++){
        if(s[i]=='0')has0=true;
        if(s[i]=='1')has1=true;
    }
    if(has0&&has1)d[id].typ='F';
    else d[id].typ=has0?'B':'I';
    if(l==r)return id;
    int mid=(l+r)>>1;
    d[id].ch[0]=Dfs(l,mid);
    d[id].ch[1]=Dfs(mid+1,r);
    return id;
}

void Visit(int u){
	if(d[u].ch[0])Visit(d[u].ch[0]);
	if(d[u].ch[1])Visit(d[u].ch[1]);
	cout<<d[u].typ;
}

int main(){
	n=read();
	scanf("%s",s+1);
	int rt=Dfs(1,(1<<n));
	Visit(rt);
	return 0;
}

