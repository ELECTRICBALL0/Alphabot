const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;
const greetingsChannelName = "인사";
const welcomeChannelComment = "어서오세요.";
const byeChannelComment = "안녕히가세요.";

client.on('ready', () => {
  console.log('켰다.');
});

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  const newUser = member.user;
  const greetingsChannel = member.guild.channels.find(channel => channel.name == greetingsChannelName);
  greetingsChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`);

  member.addRole(guild.roles.find(role => role.name == "게스트"));
});

client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  const deleteUser = member.user;
  const greetingsChannel = member.guild.channels.find(channel => channel.name == greetingsChannelName);
  const byeChannel = guild.channels.find(channel => channel.name == byeChannelName);

  greetingsChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`);
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content == 'ping') {
    return message.reply('kpong');
  }

  if(message.content == '!프로필') {
    let id = message.author.username;
    let img = message.author.displayAvatarURL;
    let embed = new Discord.RichEmbed()
      .setTitle('프로필')
      .setAuthor(id)
      .setThumbnail(img)
      .addBlankField()
      .addField('ㅇㅇ', 'ㅇㅇ')
      .addBlankField()
      .setTimestamp()
      .setFooter('by 전지호ELEC-B', img)

    message.channel.send(embed)
  } 
  else if(message.content == 'embed2') {
    let helpImg = 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png';
    let commandList = [
      {name: 'ping', desc: '현재 핑 상태'},
      {name: 'embed', desc: 'embed 예제1'},
      {name: 'embed2', desc: 'embed 예제2 (help)'},
      {name: '!전체공지', desc: 'dm으로 전체 공지 보내기'},
    ];
    let commandStr = '';
    let embed = new Discord.RichEmbed()
      .setAuthor('Help of 콜라곰 BOT', helpImg)
      .setColor('#186de6')
      .setFooter(`콜라곰 BOT ❤️`)
      .setTimestamp()
    
    commandList.forEach(x => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`;
    });

    embed.addField('Commands: ', commandStr);

    message.channel.send(embed)
  }

  if(message.content.startsWith('!전체공지')) {
    if(checkPermission(message)) return
      if(message.member != null) { // 채널에서 공지 쓸 때
        let contents = message.content.slice('!전체공지'.length);
        message.member.guild.members.array().forEach(x => {
          if(x.user.bot) return;
          x.user.send(`<@${message.author.id}> ${contents}`);
        });
        return message.reply('공지를 전송했습니다.');
      }
      else {
        return message.reply('채널에서 실행해주세요.');
      }
  }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } 
  else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

client.login(token);