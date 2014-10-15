var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves",
"show", "hn", "https", "http", "href", "quot"];
var items = [];
var nodes = [8490739];
var score = [];
while (nodes.length > 0) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://hacker-news.firebaseio.com/v0/item/" + nodes[0] + ".json", false);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var obj = JSON.parse(xhr.responseText);
                if (obj) {
                    text = obj.text ? obj.text : obj.title;
                    if (text) {
                        text = text.toLowerCase().match(/[a-z]+/g)
                        items = items.concat(text);
                        nodes = nodes.concat(obj.kids);
                    }
                }
            } else {
                console.error(xhr.statusText);
            }
        }
        nodes.shift();
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
        nodes.shift();
    };
    xhr.send(null);
}

dict = {};
for (var i = 0; i < items.length; i++) {
    debugger;
    var item = items[i];
    if (stopWords.indexOf(item) == -1) {
        if (item in dict) {
            dict[item]++;
        } else {
            dict[item] = 1;
        }
    }
}

items = [];
for (var i in dict) {
    items.push([i, dict[i]]);
}

var fill = d3.scale.category20();

d3.layout.cloud().size([300, 300])
    .words(items.map(function(d) {
        return {text: d[0], size: Math.log(d[1] + 1) * 6};
    }))
    .padding(1)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();

function draw(words) {
    d3.select("body").append("svg")
        .attr("width", 300)
        .attr("height", 300)
        .append("g")
        .attr("transform", "translate(150,150)")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}
