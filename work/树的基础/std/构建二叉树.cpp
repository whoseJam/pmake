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

int pos,tot;
char s[1000];

struct Node{
	char typ;
	int ch[2];
}d[1000];

int Dfs(){
    if(s[pos]=='.')return 0;
    int id=++tot;
    d[id].typ=s[pos];
    pos--;d[id].ch[1]=Dfs();
    pos--;d[id].ch[0]=Dfs();
    return id;
}

void Visit(int u){
	cout<<d[u].typ;
	if(d[u].ch[0])Visit(d[u].ch[0]);
	if(d[u].ch[1])Visit(d[u].ch[1]);
}

int main(){
	scanf("%s",s+1);
	pos=strlen(s+1);
	int rt=Dfs();
	Visit(rt);
	return 0;
}

