#include<iostream>
#include<cstring>
#include<cstdio>
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

const int N=100005; 
const int M=400005;
char s[N][20];

struct trie{
	int ch[26];
	int idx;
}t[M];
int tot=1;

void insert(char* from,int to){
	int u=1,l=strlen(from);
	for(int i=0,dir;i<l;i++){
		dir=from[i]-'a';
		if(!t[u].ch[dir])
			t[u].ch[dir]=++tot;
		u=t[u].ch[dir];
	}
	t[u].idx=to;
}

const char* EH="eh";

const char* translate(char* text){
	int u=1,l=strlen(text);
	for(int i=0,dir;i<l;i++){
		dir=text[i]-'a';
		if(!t[u].ch[dir])
			return EH;
		u=t[u].ch[dir];
	}
	if(t[u].idx)return s[t[u].idx];
	return EH;
}

string readString(){
	char tmp[20];
	scanf("%s",tmp);
	return tmp;
}

int main(){
	char from[25];char x;
	for(int i=1;true;i++){
		scanf("%s",s[i]+(i!=1));
		scanf("%s",from);
		if(i!=1)s[i][0]=x;
		insert(from,i);
		x=getchar();
		x=getchar();
		if(x=='\n')break;
	}
	
	while(scanf("%s",from)!=EOF){
		printf("%s\n",translate(from));
	}
	return 0;
}

