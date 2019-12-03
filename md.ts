import unified from 'unified';
import mdToMdast from 'remark-parse';
import mdastToHast from 'remark-rehype';
// import doc from 'rehype-document';
// import format from 'rehype-format';
import hastToHtml from 'rehype-stringify';
import findFrontMatter from 'remark-frontmatter';
import visit from 'unist-util-visit';
import yamlToObject from 'remark-parse-yaml';

const copyFrontmatter = () => (ast, file) => {
  visit(ast, 'yaml', (item) => {
    file.data.frontmatter = item.data.parsedValue;
  });
};

const removeFrontmatter = () => (tree) => tree.filter((node) => node.type !== 'yaml');

export const parser = (file) => {

  let res;

  unified()
    // markdown processing
    .use(mdToMdast)

    // this is if you want <html>, <body>, and <head>
    // .use(doc)
    // .use(format)

    // frontmatter processing
    .use(findFrontMatter, ['yaml'])
    .use(yamlToObject)
    .use(copyFrontmatter)

    // html processing
    .use(mdastToHast)
    .use(hastToHtml, { quoteSmart: true })

    // passing in file to processor
    .process(
      file,
      (err, vfile: {
        data: any;
        contents: any;
      }) => {
        if (err) throw err;

        res = {
          frontmatter: vfile.data.frontmatter,
          content: String(vfile.contents)
        };
      }
    );

    return res;
};
