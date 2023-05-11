import Accordion, { AccordionList } from '@components/ui/Accordion';
import Card, { CardLayout } from '@components/ui/Card';
import Flag from '@components/ui/Flag';

function Accordions() {
  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Default</Card.Title>
          </Card.Head>
          <Card.Body>
            <AccordionList>
              <Accordion>
                <Accordion.Head>
                  <Flag>default</Flag>
                  <Accordion.Title>Accordion 1</Accordion.Title>
                  optional head content
                </Accordion.Head>
                <Accordion.Body>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Accordion.Body>
              </Accordion>
              <Accordion>
                <Accordion.Head>
                  <Accordion.Title>Accordion 2</Accordion.Title>
                </Accordion.Head>
                <Accordion.Body>
                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab
                    accusamus, architecto commodi consequatur cum delectus dignissimos
                    doloribus est labore nemo, odit officia officiis quae reiciendis
                    voluptates voluptatibus. Sed, voluptatum.
                  </div>
                  <div>
                    A aliquid, beatae debitis deleniti dolores eligendi hic, ipsum iusto
                    labore laboriosam non quod sapiente sint? Ad asperiores atque
                    blanditiis consequatur et fuga illo iste nostrum suscipit totam.
                    Commodi, ea.
                  </div>
                  <div>
                    Alias animi assumenda, blanditiis, distinctio dolore esse fugiat in
                    inventore iusto libero minima nemo nihil non odio quas qui quis quod
                    reiciendis rem repudiandae saepe, suscipit ullam veritatis voluptas
                    voluptatibus.
                  </div>
                  <div>
                    Aliquam aut blanditiis ducimus ea eius illum quidem repellendus
                    suscipit totam unde. Accusamus accusantium aliquam autem dolor eum hic
                    id molestias non quae totam! Accusamus eaque fuga illo inventore
                    nulla?
                  </div>
                  <div>
                    Ab accusantium necessitatibus nihil nisi nostrum recusandae. Aliquam,
                    animi commodi consectetur consequuntur culpa debitis doloribus
                    eligendi enim exercitationem explicabo id illum minus necessitatibus
                    omnis, possimus provident repellat saepe voluptates voluptatibus.
                  </div>
                  <div>
                    Accusamus ad adipisci aliquid asperiores consectetur debitis dolorum
                    eos et exercitationem fugiat fugit illum inventore ipsum modi
                    necessitatibus odit optio perspiciatis possimus praesentium quas quasi
                    quod, quos tempore voluptates voluptatum!
                  </div>
                  <div>
                    Ab aliquam aliquid, aspernatur consequuntur culpa, delectus enim eos
                    fuga fugiat id inventore iure labore libero magnam maiores minus
                    numquam officiis quae quas quos sit sunt voluptatem? Dolor officiis,
                    omnis.
                  </div>
                  <div>
                    Aliquam expedita laudantium magnam quae reprehenderit rerum sint
                    voluptates. Aliquid dignissimos dolores eveniet excepturi harum
                    incidunt, laudantium maiores nesciunt nihil reiciendis velit veritatis
                    vero voluptate! Numquam praesentium sequi similique voluptatibus.
                  </div>
                  <div>
                    Ad adipisci atque consectetur cumque deserunt dolor ea eius est eum,
                    inventore laudantium minima mollitia neque nisi optio possimus quis
                    ratione recusandae repellendus sint, soluta suscipit tempora ullam ut
                    voluptatibus!
                  </div>
                  <div>
                    Ab dignissimos doloribus dolorum eaque earum, eligendi expedita facere
                    hic inventore ipsa ipsam natus nostrum recusandae repellendus
                    reprehenderit, ullam, vel voluptas voluptates! Architecto debitis
                    distinctio fugit incidunt quo veritatis, voluptatum?
                  </div>
                </Accordion.Body>
              </Accordion>
            </AccordionList>
          </Card.Body>
        </Card>
        <Card col="12">
          <Card.Head>
            <Card.Title>열려있는 아코디언 닫힘설정</Card.Title>
          </Card.Head>
          <Card.Body>
            <AccordionList autoClose="true">
              <Accordion id="accordion-1">
                <Accordion.Head>
                  <Flag>default</Flag>
                  <Accordion.Title>Accordion 1</Accordion.Title>
                  optional head content
                </Accordion.Head>
                <Accordion.Body>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Accordion.Body>
              </Accordion>
              <Accordion id="accordion-2">
                <Accordion.Head>
                  <Accordion.Title>Accordion 2</Accordion.Title>
                </Accordion.Head>
                <Accordion.Body>
                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab
                    accusamus, architecto commodi consequatur cum delectus dignissimos
                    doloribus est labore nemo, odit officia officiis quae reiciendis
                    voluptates voluptatibus. Sed, voluptatum.
                  </div>
                  <div>
                    A aliquid, beatae debitis deleniti dolores eligendi hic, ipsum iusto
                    labore laboriosam non quod sapiente sint? Ad asperiores atque
                    blanditiis consequatur et fuga illo iste nostrum suscipit totam.
                    Commodi, ea.
                  </div>
                  <div>
                    Alias animi assumenda, blanditiis, distinctio dolore esse fugiat in
                    inventore iusto libero minima nemo nihil non odio quas qui quis quod
                    reiciendis rem repudiandae saepe, suscipit ullam veritatis voluptas
                    voluptatibus.
                  </div>
                  <div>
                    Aliquam aut blanditiis ducimus ea eius illum quidem repellendus
                    suscipit totam unde. Accusamus accusantium aliquam autem dolor eum hic
                    id molestias non quae totam! Accusamus eaque fuga illo inventore
                    nulla?
                  </div>
                  <div>
                    Ab accusantium necessitatibus nihil nisi nostrum recusandae. Aliquam,
                    animi commodi consectetur consequuntur culpa debitis doloribus
                    eligendi enim exercitationem explicabo id illum minus necessitatibus
                    omnis, possimus provident repellat saepe voluptates voluptatibus.
                  </div>
                  <div>
                    Accusamus ad adipisci aliquid asperiores consectetur debitis dolorum
                    eos et exercitationem fugiat fugit illum inventore ipsum modi
                    necessitatibus odit optio perspiciatis possimus praesentium quas quasi
                    quod, quos tempore voluptates voluptatum!
                  </div>
                  <div>
                    Ab aliquam aliquid, aspernatur consequuntur culpa, delectus enim eos
                    fuga fugiat id inventore iure labore libero magnam maiores minus
                    numquam officiis quae quas quos sit sunt voluptatem? Dolor officiis,
                    omnis.
                  </div>
                  <div>
                    Aliquam expedita laudantium magnam quae reprehenderit rerum sint
                    voluptates. Aliquid dignissimos dolores eveniet excepturi harum
                    incidunt, laudantium maiores nesciunt nihil reiciendis velit veritatis
                    vero voluptate! Numquam praesentium sequi similique voluptatibus.
                  </div>
                  <div>
                    Ad adipisci atque consectetur cumque deserunt dolor ea eius est eum,
                    inventore laudantium minima mollitia neque nisi optio possimus quis
                    ratione recusandae repellendus sint, soluta suscipit tempora ullam ut
                    voluptatibus!
                  </div>
                  <div>
                    Ab dignissimos doloribus dolorum eaque earum, eligendi expedita facere
                    hic inventore ipsa ipsam natus nostrum recusandae repellendus
                    reprehenderit, ullam, vel voluptas voluptates! Architecto debitis
                    distinctio fugit incidunt quo veritatis, voluptatum?
                  </div>
                </Accordion.Body>
              </Accordion>
              <Accordion id="accordion-3">
                <Accordion.Head>
                  <Accordion.Title>Accordion 3</Accordion.Title>
                </Accordion.Head>
                <Accordion.Body>
                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab
                    accusamus, architecto commodi consequatur cum delectus dignissimos
                    doloribus est labore nemo, odit officia officiis quae reiciendis
                    voluptates voluptatibus. Sed, voluptatum.
                  </div>
                  <div>
                    A aliquid, beatae debitis deleniti dolores eligendi hic, ipsum iusto
                    labore laboriosam non quod sapiente sint? Ad asperiores atque
                    blanditiis consequatur et fuga illo iste nostrum suscipit totam.
                    Commodi, ea.
                  </div>
                  <div>
                    Alias animi assumenda, blanditiis, distinctio dolore esse fugiat in
                    inventore iusto libero minima nemo nihil non odio quas qui quis quod
                    reiciendis rem repudiandae saepe, suscipit ullam veritatis voluptas
                    voluptatibus.
                  </div>
                  <div>
                    Aliquam aut blanditiis ducimus ea eius illum quidem repellendus
                    suscipit totam unde. Accusamus accusantium aliquam autem dolor eum hic
                    id molestias non quae totam! Accusamus eaque fuga illo inventore
                    nulla?
                  </div>
                  <div>
                    Ab accusantium necessitatibus nihil nisi nostrum recusandae. Aliquam,
                    animi commodi consectetur consequuntur culpa debitis doloribus
                    eligendi enim exercitationem explicabo id illum minus necessitatibus
                    omnis, possimus provident repellat saepe voluptates voluptatibus.
                  </div>
                  <div>
                    Accusamus ad adipisci aliquid asperiores consectetur debitis dolorum
                    eos et exercitationem fugiat fugit illum inventore ipsum modi
                    necessitatibus odit optio perspiciatis possimus praesentium quas quasi
                    quod, quos tempore voluptates voluptatum!
                  </div>
                  <div>
                    Ab aliquam aliquid, aspernatur consequuntur culpa, delectus enim eos
                    fuga fugiat id inventore iure labore libero magnam maiores minus
                    numquam officiis quae quas quos sit sunt voluptatem? Dolor officiis,
                    omnis.
                  </div>
                  <div>
                    Aliquam expedita laudantium magnam quae reprehenderit rerum sint
                    voluptates. Aliquid dignissimos dolores eveniet excepturi harum
                    incidunt, laudantium maiores nesciunt nihil reiciendis velit veritatis
                    vero voluptate! Numquam praesentium sequi similique voluptatibus.
                  </div>
                  <div>
                    Ad adipisci atque consectetur cumque deserunt dolor ea eius est eum,
                    inventore laudantium minima mollitia neque nisi optio possimus quis
                    ratione recusandae repellendus sint, soluta suscipit tempora ullam ut
                    voluptatibus!
                  </div>
                  <div>
                    Ab dignissimos doloribus dolorum eaque earum, eligendi expedita facere
                    hic inventore ipsa ipsam natus nostrum recusandae repellendus
                    reprehenderit, ullam, vel voluptas voluptates! Architecto debitis
                    distinctio fugit incidunt quo veritatis, voluptatum?
                  </div>
                </Accordion.Body>
              </Accordion>
            </AccordionList>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
}

export default Accordions;
